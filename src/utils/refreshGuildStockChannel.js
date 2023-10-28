const GuildData = require("../models/GuildData");
const { EmbedBuilder } = require('discord.js');
const fruitsValue = require("../utils/getDevilsFruitPrice")();
const fruitsNames = Object.keys(fruitsValue);
const stock = require("../utils/getCurrentStock");

module.exports = async (client, guildId) => {

    const query = {
        guildId: guildId,
    }

    try {
        var gldData = await GuildData.findOne(query);
        if (!gldData || !gldData.stockChannel) return;
        
        const guild = client.guilds.cache.get(guildId);
        const channel = guild.channels.cache.get(gldData.stockChannel);

        var messageId = gldData.stockMessageId;

        const currStock = await stock();
         
        const fruitFields = [];
        for (const fruit of currStock) {
            fruitFields.push({
                name: fruit,
                value: fruitsValue[fruit],
                inline: true,
            });
        }
        console.log([{name:"test",value:"test",inline:true}])
        console.log(fruitFields)
        const embed = new EmbedBuilder()
            .setTitle('Current stock')
            .setColor('#07eded')
        
        embed.addFields(fruitFields);
        try{
            // Modify message
            const message  = await channel.messages.fetch(messageId);
            message.edit({ embeds: [embed] });
        } catch{
            // Create a new message if the old one was deleted or doesn't exist
            const message = await channel.send({ embeds: [embed] });
            messageId = message.id;
        }

        gldData.stockMessageId = messageId;
        console.log(messageId)
        await gldData.save().catch((error) => {
            console.log(`Error while updating data :${error}`);
            return;
        });
        console.log("new guild data saved")
    } catch(error) {
        console.log(`Error: ${error}`)
    }

    return true;
};