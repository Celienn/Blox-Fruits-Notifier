import { Client, GuildChannel, TextChannel, type PermissionResolvable } from 'discord.js';
//const canSendMessages = await hasPermission(client, interaction.options.getChannel('channel'), PermissionsBitField.Flags.SendMessages);

export default async function hasPermissions(client: Client, channel: GuildChannel, permission: PermissionResolvable | PermissionResolvable[]) {

    // Check if the channel exists
    if (!channel) {
        console.log(`[Utils checkBotPermissions]: Channel is undefined.`);
        return false;
    }

    const bot = channel.guild.members.me;
    if (!bot) return false;

    // Get the bot's permissions in the channel
    const botPermissions = channel.permissionsFor(bot);

    if (!botPermissions) {
        console.log(`[Utils checkBotPermissions]: Unable to get permissions for bot in channel ${channel.id}.`);
        return false;
    }

    // Return if the bot has the permission
    return botPermissions.has(permission);
}