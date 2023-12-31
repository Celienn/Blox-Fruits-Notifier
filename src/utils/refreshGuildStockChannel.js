const GuildData = require("../models/GuildData");
const { EmbedBuilder } = require('discord.js');
const fruitsValue = require("../utils/getDevilsFruitPrice");
const stockImg = require("../utils/generateStockImg");
const fruitsNames = Object.keys(fruitsValue);
const nextStock = require("./getStockTime")

module.exports = async (client, guildId, currStock) => {

    const query = {
        id: guildId,
    }

    try {
        var gldData = await GuildData.findOne(query);
        if (!gldData || !gldData.stockChannel) return;
        
        const guild = client.guilds.cache.get(guildId);
        const channel = guild.channels.cache.get(gldData.stockChannel);

        var messageId = gldData.stockMessageId;
         
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

        fruitFields.push({
            name: ' ',
            value: `Next refresh <t:${nextStock.nextTimestamp()}:R>`,
            inline: false,
        })
        
        embed.addFields(fruitFields);
        
        try{
            // Modify message
            const message  = await channel.messages.fetch(messageId);
            const file = {
                attachment: await stockImg(currStock),
                name:'image.png'
            }
            message.edit({ embeds: [embed] , files: [file]});
        } catch{
            // Create a new message if the old one was deleted or doesn't exist
            const message = await channel.send({ embeds: [embed] });
            messageId = message.id;
        }
        
        gldData.stockMessageId = messageId;

        await gldData.save().catch((error) => {
            console.log(`Error while updating data :${error}`);
            return;
        });
    } catch(error) {
        console.log(`Error: ${error}`)
    }

    return true;
};