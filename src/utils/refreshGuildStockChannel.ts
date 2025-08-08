import axios from 'axios';
import GuildData from '../models/GuildData.js';
import { EmbedBuilder, type APIEmbedField } from 'discord.js';
import stockImg from './generateStockImg.js';
import stock from './stockTime.js';
import { Client, ChannelType } from 'discord.js';

// todo fix
async function getLastCommitDate() {
    const gitrepo = process.env["GIT_REPO"];
    try {
        const response = await axios.get(`https://api.github.com/repos/${gitrepo}/commits`, { timeout: 10000 });
        const lastCommit = response.data[0];
        return lastCommit.commit.committer.date;
    } catch (error) {
        const err = error as any;
        if (axios.isCancel(err)) console.log(`[getLastCommitDate] Request canceled: ${err.message}`);
        else if (err.code === 'ECONNRESET') console.log(`[getLastCommitDate] Connection reset by peer: ${err.message}`);
        else console.log(`[getLastCommitDate] Error fetching commits: ${err.message}`);
        
        return null;
    }
}

var storedStock: string[] = [];
const lastCommitDate = (async () => {
    return await getLastCommitDate();
})().then(date => {
    return date ? new Date(date) : null;
});

export default async (client: Client, guildId: string, currStock: string[] = [""]) => {

    storedStock = (currStock.length === 1 && currStock[0] === "") ? storedStock : currStock;

    const query = {
        id: guildId,
    }

    try {
        let gldData = await GuildData.findOne(query);
        if (!gldData || !gldData.stockChannel) return;
        
        const guild = client.guilds.cache.get(guildId);

        if (guild === undefined  || !guild.available) {
            console.log(`Bot no longer in guild "${guildId}".`);
            GuildData.deleteOne(query).catch((error) => {
                console.log(`[Utils refreshGuildStockChannel] Error while deleting data 1 :${error}`);
            });
            console.log(`Deleted guild "${guildId}" from the database.`);
            return;
        }

        const channel = guild.channels.cache.get(gldData.stockChannel);
        if (!channel || channel.type !== ChannelType.GuildText) {
            console.log(`Channel no longer exist "${gldData.stockChannel}".`);
            GuildData.deleteOne(query).catch((error) => {
                console.log(`[Utils refreshGuildStockChannel] Error while deleting data 2 :${error}`);
            });
            console.log(`Deleted channel "${gldData.stockChannel}" from the database.`);
            return;
        }

        let messageId = gldData.stockMessageId;
        
        const fruitFields: APIEmbedField[] = [];

        const embed = new EmbedBuilder()
            .setTitle('Current stock')
            .setColor('#07eded')
            .setThumbnail('https://cdn.discordapp.com/attachments/679071256305205258/1168065315217866822/Blox_Fruits.png')
            .setImage('attachment://image.png')

        if (process.env["GIT_REPO"] && (await lastCommitDate) !== null) {
            embed.setFooter({ text: 'Last bot update', iconURL: 'https://i.imgur.com/5k8Jln8.png' })
                    .setTimestamp(await lastCommitDate);
        }

        fruitFields.push({
            name: ' ',
            value: `Expires <t:${stock.nextTimestamp()}:R>`,
            inline: false,
        })
        
        embed.addFields(fruitFields);

        const file = {
            attachment: await stockImg(storedStock),
            name:'image.png'
        }

        try{
            if (!messageId) throw new Error("No messageId available");
            // Modify message
            const message  = await channel.messages.fetch(messageId);
            message.edit({ embeds: [embed], files: [file]});
        } catch {
            // Create a new message if the old one was deleted or doesn't exist
            const message = await channel.send({ embeds: [embed],  files: [file]});
            messageId = message.id;
        }
        
        gldData.stockMessageId = messageId;

        await gldData.save().catch((error) => { 
            console.log(`[Utils refreshGuildStockChannel] Error while updating data :${error}`);
            return;
        });
    } catch(error) {
        console.log(`[Utils refreshGuildStockChannel]: ${error}`);
    }

    return true;
};