const { ApplicationCommandOptionType } = require("discord.js");
const GuildData = require("../models/GuildData");

module.exports = {
    name: 'stockchannel',
    description: 'Set the channel where the current blox fruit stock will be shown',
    adminOnly: true,
    callback: async (client, interaction) => {
        try {
            
            // Search in  the data base if an entry already exist for the current guild 
            const query = {
                guildId: interaction.guild.id,
            }

            try {
                var gldData = await GuildData.findOne(query);

                if (gldData) {
                    // Add the new fruit to the user data 
                    gldData.stockChannel = interaction.channelId;

                }else {
                    // Create an entry for the user in the data base
                    gldData = new GuildData({
                        guildId: interaction.guild.id,
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

            const response = await interaction.reply("The new stock channel was succesfully set.");

            setTimeout(() =>{
                response.delete();
            },2000);
        } catch (error) {
            console.log(`Error: ${error}`);
        }

    },
}

