const GuildData = require("../models/GuildData");
const refreshStockChannel = require("../utils/refreshGuildStockChannel");

module.exports = {
    name: 'stockchannel',
    description: 'Set the channel where the current blox fruit stock will be shown',
    default_member_permissions: "0",
    callback: async (client, interaction) => {
        try {

            // Search in  the data base if an entry already exist for the current guild 
            const query = {
                id: interaction.guild.id,
            }

            try {
                var gldData = await GuildData.findOne(query);

                if (gldData) {
                    if (gldData.stockChannel != interaction.channelId && (gldData.stockChannel && gldData.stockMessageId)) {
                        // Not the best it would be better to delete the message afther the data base is updated
                        try{
                            const channel = interaction.guild.channels.cache.get(gldData.stockChannel);
                            const message = await channel.messages.fetch(gldData.stockMessageId);
                            if (message) message.delete();
                        }catch{}
                        gldData.stockMessageId = "";
                    }
                    // Add the new fruit to the user data 
                    gldData.stockChannel = interaction.channelId;

                }else {
                    // Create an entry for the user in the data base
                    gldData = new GuildData({
                        id: interaction.guild.id,
                        stockChannel: interaction.channelId,
                    })
                }
                // Save the new data to the data base
                await gldData.save().catch((error) => {
                    console.log(`Error while updating data :${error}`);
                    return;
                });
            } catch(error) {
                console.log(`Error: ${error}`)
            }

            interaction.reply({
                content: "The new stock channel was succesfully set.",
                ephemeral: true,
            });

            refreshStockChannel(client, interaction.guild.id);

        } catch (error) {
            console.log(`Error: ${error}`);
        }

    },
}

