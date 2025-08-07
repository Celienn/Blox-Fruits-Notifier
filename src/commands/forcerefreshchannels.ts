import { Client, ChatInputCommandInteraction } from 'discord.js';
import { refreshAllStockChannel } from '../events/ready/autoRefreshStockChannel.js';

export default {
    name: 'forcerefreshchannels',
    description: 'Manually refresh all the stock channels.',
    default_member_permissions: "0",
    test: true,
    options: [],
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        await refreshAllStockChannel(client);
        interaction.reply({ content: "All stock channels have been refreshed.", ephemeral: true });
    },
}

