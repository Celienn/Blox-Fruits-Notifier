import axios from 'axios';
import GuildData from '../models/GuildData.js';
import { EmbedBuilder, type APIEmbedField } from 'discord.js';
import stock from './stock.js';
import { Client, ChannelType } from 'discord.js';
import hasPermissions from './checkBotPermissions.js';

// todo fix
async function getLastCommitDate() {
    const gitrepo = process.env["GIT_REPO"];
    try {
        const response = await axios.get(`https://api.github.com/repos/${gitrepo}/commits`, { timeout: 10000 });
        const lastCommit = response.data[0];
        return lastCommit.commit.committer.date;
    } catch (error) {
        const err = error as any;
        if (axios.isCancel(err)) console.error(`[getLastCommitDate] Request canceled: ${err.message}`);
        else if (err.code === 'ECONNRESET') console.error(`[getLastCommitDate] Connection reset by peer: ${err.message}`);
        else console.error(`[getLastCommitDate] Error fetching commits: ${err.message}`);
        
        return null;
    }
}

const lastCommitDate = (async () => {
    return await getLastCommitDate();
})().then(date => {
    return date ? new Date(date) : null;
});

// * Ik the code isn't great , will clean it later
export default async (client: Client, guildId: string) => {

    const URL = stock.getUrl();

    const query = {
        id: guildId,
    }

    try {
        let gldData = await GuildData.findOne(query);
        if (!gldData || !gldData.stockChannel) return;
    
        const guild = client.guilds.cache.get(gldData.id);
        if (guild === undefined  || !guild.available) {
            GuildData.deleteOne({ id: gldData.id }).catch((error) => {
                console.error(`[Utils refreshGuildStockChannel] Error while deleting data 1 :${error}`);
            });
            console.log(`Deleted guild "${gldData.id}" from the database. Reason : Bot no longer in guild.`);
            return;
        }

        const channel = guild.channels.cache.get(gldData.stockChannel);
        if (!channel || channel.type !== ChannelType.GuildText) {
            GuildData.deleteOne({ id: gldData.id }).catch((error) => {
                console.error(`[Utils refreshGuildStockChannel] Error while deleting data 2 :${error}`);
            });
            console.log(`Deleted channel "${gldData.stockChannel}" from the database. Reason : Channel no longer exists.`);
            return;
        }

        let messageId = gldData.stockMessageId;

        if (await hasPermissions(client, channel, "SendMessages") === false) {
            GuildData.deleteOne({ id: gldData.id }).catch((error) => {
                console.error(`[Utils refreshGuildStockChannel] Error while deleting data 3 :${error}`);
            });
            console.log(`Deleted channel "${gldData.stockChannel}" from the database. Reason : Bot does not have permission to send messages.`);
            return;
        }

        const fruitFields: APIEmbedField[] = [];

        const embed = new EmbedBuilder()
            .setTitle('Current stock')
            .setColor('#07eded')
            .setThumbnail('https://cdn.discordapp.com/attachments/679071256305205258/1168065315217866822/Blox_Fruits.png')
            .setImage((URL) ? URL : 'attachment://image.png')

        if (process.env["GIT_REPO"] && (await lastCommitDate) !== null) {
            embed.setFooter({ text: 'Last bot update', iconURL: 'https://i.imgur.com/5k8Jln8.png' })
                    .setTimestamp(await lastCommitDate);
        }

        const discordTimestamp = Math.floor(stock.nextTimestamp() / 1000);
        fruitFields.push({
            name: ' ',
            value: `Expires <t:${discordTimestamp}:R>`,
            inline: false,
        })
        
        embed.addFields(fruitFields);

        const file = (URL) ? [] :
        [{
            attachment: await stock.genImg(),
            name:'image.png'
        }];

        let message;
        try{
            if (!messageId) throw new Error("No messageId available");
            // Modify message
            message = await channel.messages.fetch(messageId);
            await message.edit({ embeds: [embed], files: file});
        } catch {
            // Create a new message if the old one was deleted or doesn't exist
            message = await channel.send({ embeds: [embed],  files: file});
            messageId = message.id;
        }
        
        if (!URL) stock.setUrl(message.embeds[0]?.image?.url);

        // Todo don't save to the data base if it wasn't modified
        gldData.stockMessageId = messageId;

        await gldData.save().catch((error) => { 
            console.error(`[Utils refreshGuildStockChannel] Error while updating data :${error}`);
        });
    } catch(error) {
        console.error(`[Utils refreshGuildStockChannel]: ${error}`);
    }

    return URL;
};