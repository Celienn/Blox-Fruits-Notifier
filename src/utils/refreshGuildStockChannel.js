const GuildData = require("../models/GuildData");
const { EmbedBuilder } = require('discord.js');
const stockImg = require("../utils/generateStockImg");
const nextStock = require("./getStockTime")
const axios = require('axios');

async function getLastCommitDate() {
    const gitrepo = process.env.GIT_REPO;
    try {
        const response = await axios.get(`https://api.github.com/repos/${gitrepo}/commits`, { timeout: 10000 });
        const lastCommit = response.data[0];
        return lastCommit.commit.committer.date;
    } catch (error) {
        if (axios.isCancel(error)) console.log(`[getLastCommitDate] Request canceled: ${error.message}`);
        else if (error.code === 'ECONNRESET') console.log(`[getLastCommitDate] Connection reset by peer: ${error.message}`);
        else console.log(`[getLastCommitDate] Error fetching commits: ${error.message}`);
        
        return null;
    }
}

var storedStock = [];
const lastCommitDate = (async () => {
    return await getLastCommitDate();
})().then(date => {
    return date ? new Date(date) : null;
});

module.exports = async (client, guildId, currStock) => {

    storedStock = currStock || storedStock;
    
    const query = {
        id: guildId,
    }

    try {
        let gldData = await GuildData.findOne(query);
        if (!gldData || !gldData.stockChannel) return;
        
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.log(`Bot no longer in guild "${guildId}".`);
            GuildData.deleteOne(query).catch((error) => {
                console.log(`[Utils refreshGuildStockChannel] Error while deleting data :${error}`);
            });
            console.log(`Deleted guild "${guildId}" from the database.`);
        }

        const channel = guild.channels.cache.get(gldData.stockChannel);
        let messageId = gldData.stockMessageId;
         
        const fruitFields = [];
        // for (const fruit of currStock) {
        //     fruitFields.push({
        //         name: fruit,
        //         value: fruitsValue[fruit],
        //         inline: true,
        //     });
        // }

        const embed = new EmbedBuilder()
            .setTitle('Current stock')
            .setColor('#07eded')
            .setThumbnail('https://cdn.discordapp.com/attachments/679071256305205258/1168065315217866822/Blox_Fruits.png')
            .setImage('attachment://image.png')

        if (process.env.GIT_REPO && (await lastCommitDate) !== null) {
            embed.setFooter({ text: 'Last bot update', iconURL: 'https://i.imgur.com/5k8Jln8.png' })
                    .setTimestamp(await lastCommitDate);
        }

        fruitFields.push({
            name: ' ',
            value: `Expires <t:${nextStock.nextTimestamp()}:R>`,
            inline: false,
        })
        
        embed.addFields(fruitFields);

        const file = {
            attachment: await stockImg(storedStock),
            name:'image.png'
        }

        try{
            // Modify message
            const message  = await channel.messages.fetch(messageId);
            message.edit({ embeds: [embed], files: [file]});
        } catch{
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