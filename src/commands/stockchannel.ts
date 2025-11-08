import GuildData, { type IGuildData } from '../models/GuildData.js';
import { Client, ChatInputCommandInteraction, type Channel, ChannelType, type PermissionsString, TextChannel } from 'discord.js';
import refreshStockChannel from '../utils/refreshGuildStockChannel.js';
import type { Document } from 'mongoose';
import { InteractionContextType } from 'discord.js';
import checkBotPermissions from '../utils/checkBotPermissions.js';

async function removeOldStockMessage(client: Client, data: Document<IGuildData>): Promise<Channel | void> { 
    const stockChannel = data.get('stockChannel');
    const stockMessageId = data.get('stockMessageId');
    if (stockChannel && stockMessageId) {
        const oldChannel = client.channels.cache.get(stockChannel);

        // Check if oldChannel is a TextChannel before accessing messages
        if (oldChannel && oldChannel.isTextBased()) {
            try {
                const message = await oldChannel.messages.fetch(stockMessageId);
                if (message) message.delete();
            } catch (error) {
                console.error(`[Command /stockchannel] Error while deleting the old message for guild "${data.get('id')}": ${error}`);
            }
        }
        
        data.set('stockChannel', "");
        data.set('stockMessageId', "");

        return oldChannel;
    }
}

// * not very proud of my code but will do the job for now
export default {
    name: 'stockchannel',
    description: 'Set the channel where the current blox fruit stock will be shown',
    default_member_permissions: "0",
    requiredPermissions: [] as PermissionsString[],
    options: [
        {
            type: 1,
            name: 'set',
            description: 'Set the channel where the current blox fruit stock will be shown',
            options: [
                {
                    name: 'channel',
                    description: 'The channel in which the stock will be shown and updated in real time',
                    type: 7,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: 'remove',
            description: 'Stop the bot from sending stock updates in the current channel',
            options: []
        }
    ],
    contexts: [InteractionContextType.Guild],
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {

        const channel = interaction.options.getChannel('channel');
        const sub = interaction.options.getSubcommand();
        const removeValue = sub === 'remove';
        var reply = "An unexpected error occurred.";

        if (!interaction.guild) { // ? maybe i should make it possible
            interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
            return;
        }

        // Search in the data base if an entry already exist for the current guild 
        const query = {
            id: interaction.guild.id,
        }

        try {
            let gldData = await GuildData.findOne(query) as Document<IGuildData>;
            
            if (!gldData) {
                // Create an entry for the guild in the data base
                gldData = new GuildData({
                    id: interaction.guild.id
                }) as Document<IGuildData>;
            }
            
            if (removeValue) {  
                // ? Would be better to delete the message after the data base is updated
                const oldChannel = await removeOldStockMessage(client, gldData);
                gldData.set('stockChannel', "");

                reply = (oldChannel) ? `Stock updates have been removed from <#${oldChannel.id}>.` : "Stock updates have been removed.";
            }else {
                if (!channel || channel.type !== ChannelType.GuildText) {
                    interaction.reply({ content: "Please select a valid text channel.", ephemeral: true });
                    return;
                }

                if ( await checkBotPermissions(client, channel as TextChannel, 'SendMessages') === false ) {
                    interaction.reply({ content: "I don't have permission to send messages in that channel.", ephemeral: true });
                    return;
                }

                // Remove the old message if the channel provided is a new one
                if (gldData.get('stockChannel') !== channel.id) await removeOldStockMessage(client, gldData);
                gldData.set('stockChannel', channel.id);
                
                reply = `Stock updates will now be sent in <#${channel.id}>.`;
            }

            // ? i could avoid saving the data if the channel is the same
            // ? may send the answer after the data base is updated , so it doesn't send the message if there is an error
            // Save the new data to the data base
            await gldData.save().catch((error) => {
                const guildId = interaction.guild ? interaction.guild.id : 'unknown';
                console.error(`[Command /stockchannel] Error while editing database for guild "${guildId}":${error}`);
                return;
            });

        } catch(error) {
            console.error(`[Command /stockchannel] Error while editing database for guild "${interaction.guild.id}": ${error}`)
            reply = "Something went wrong.";
        }
        
        interaction.reply({
            content: reply,
            ephemeral: true,
        });

        refreshStockChannel(client, interaction.guild.id);
    }
}

