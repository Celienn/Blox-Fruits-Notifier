const GuildData = require("../models/GuildData");
const refreshStockChannel = require("../utils/refreshGuildStockChannel");
const hasPermission = require("../utils/checkBotPermissions");
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'stockchannel',
    description: 'Set the channel where the current blox fruit stock will be shown',
    default_member_permissions: "0",
    options: [
        {
            name: 'channel',
            description: 'The channel in which the stock will be shown and updated in real time',
            type: 7,
            required: true
        
        }
    ],
    callback: async (client, interaction) => {
        try {
            
            const canSendMessages = await hasPermission(client, interaction.options.getChannel('channel'), PermissionsBitField.Flags.SendMessages);
            if(!canSendMessages){
                console.log("pls pls pls")
                interaction.reply({
                    content: "Please give the bot the permission to send messages in the channel.",
                    ephemeral: true,
                });
                return;
            }

            // Search in the data base if an entry already exist for the current guild 
            const query = {
                id: interaction.guild.id,
            }

            try {
                var gldData = await GuildData.findOne(query);

                if (gldData) {
                    if (gldData.stockChannel != interaction.options.getChannel('channel').id && (gldData.stockChannel && gldData.stockMessageId)) {
                        // Not the best it would be better to delete the message after the data base is updated
                        try{
                            const channel = interaction.guild.channels.cache.get(gldData.stockChannel);
                            const message = await channel.messages.fetch(gldData.stockMessageId);
                            if (message) message.delete();
                        }catch{
                            console.error(`[Command /stockchannel] Error while deleting the old message for guild "${interaction.guild.id}"`);
                        }
                        gldData.stockMessageId = "";
                    }
                    // Update the stock channel
                    gldData.stockChannel = interaction.options.getChannel('channel').id;

                }else {
                    // Create an entry for the user in the data base
                    gldData = new GuildData({
                        id: interaction.guild.id,
                        stockChannel: interaction.options.getChannel('channel').id,
                    })
                }
                // Save the new data to the data base
                await gldData.save().catch((error) => {
                    console.error(`[Command /stockchannel] Error while editing database for guild "${interaction.guild.id}":${error}`);
                    return;
                });
            } catch(error) {
                console.error(`[Command /stockchannel] Error while editing database for guild "${interaction.guild.id}": ${error}`)
            }

            interaction.reply({
                content: "The new stock channel was succesfully set.",
                ephemeral: true,
            });

            refreshStockChannel(client, interaction.guild.id);

        } catch (error) {
            console.error(`[Command /stockchannel] Error in guild "${interaction.guild.id}" : ${error}`);
        }

    },
}

