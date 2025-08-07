import GuildData from '../models/GuildData.js';
import { Client, ChatInputCommandInteraction } from 'discord.js';
import refreshStockChannel from '../utils/refreshGuildStockChannel.js';

// todo use 
// todo fix when using remove option only remove form the db but don't delete the message
export default {
    name: 'stockchannel',
    description: 'Set the channel where the current blox fruit stock will be shown',
    default_member_permissions: "0",
    options: [
        {
            name: 'channel',
            description: 'The channel in which the stock will be shown and updated in real time',
            type: 7,
            required: true
        },
        {
            name: 'remove',
            description: 'Stop the bot from sending stock updates in the current channel',
            type: 5,
            required: false
        }
    ],
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {

        const channel = interaction.options.getChannel('channel');

        if (!interaction.guild) {
            interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
            return;
        }

        if (!channel || channel.type !== 0) { // 0 is GUILD_TEXT
            interaction.reply({ content: "Please select a valid text channel.", ephemeral: true });
            return;
        }
 
        try {

            // Search in the data base if an entry already exist for the current guild 
            const query = {
                id: interaction.guild.id,
            }

            try {
                let gldData = await GuildData.findOne(query);
                
                if (gldData) {        
                    const removeOption = interaction.options.get('remove');
                    if (removeOption) var removeValue = removeOption.value;

                    if ( (gldData.stockChannel != channel.id || removeValue) && (gldData.stockChannel && gldData.stockMessageId) ) {
                        // ? Would be better to delete the message after the data base is updated
                        try{
                            const oldChannel = interaction.guild.channels.cache.get(gldData.stockChannel);
                            if (!oldChannel || oldChannel.type !== 0) return;
                            
                            const message = await oldChannel.messages.fetch(gldData.stockMessageId);
                            if (message) message.delete();
                        }catch (error) {
                            console.error(`[Command /stockchannel] Error while deleting the old message for guild "${interaction.guild.id}": ${error}`);
                        }
                        gldData.stockMessageId = "";
                    }
                    
                    // Update the stock channel
                    if (removeValue) gldData.stockChannel = "";
                    else gldData.stockChannel = channel.id;

                } else {
                    // Create an entry for the guild in the data base
                    gldData = new GuildData({
                        id: interaction.guild.id,
                        stockChannel: channel.id,
                    })
                }
                // Save the new data to the data base
                await gldData.save().catch((error) => {
                    const guildId = interaction.guild ? interaction.guild.id : 'unknown';
                    console.error(`[Command /stockchannel] Error while editing database for guild "${guildId}":${error}`);
                    return;
                });
            } catch(error) {
                console.error(`[Command /stockchannel] Error while editing database for guild "${interaction.guild.id}": ${error}`)
            }
            
            interaction.reply({
                content: (removeValue) ? `Stock updates have been removed from <#${channel.id}>.` : `Stock updates will now be sent in <#${channel.id}>.`,
                ephemeral: true,
            });

            refreshStockChannel(client, interaction.guild.id);

        } catch (error) {
            console.error(`[Command /stockchannel] Error in guild "${interaction.guild.id}" : ${error}`);
        }

    },
}

