//const canSendMessages = await hasPermission(client, interaction.options.getChannel('channel'), PermissionsBitField.Flags.SendMessages);

module.exports = async (client, channel, permission) => {

    // Check if the channel exists
    if (!channel) {
        console.log(`[Utils checkBotPermissions]: Channel is undefined.`);
        return false;
    }

    // Get the bot's permissions in the channel
    const botPermissions = channel.permissionsFor(channel.guild.members.me);

    if (!botPermissions) {
        console.log(`[Utils checkBotPermissions]: Unable to get permissions for bot in channel ${channelId}.`);
        return false;
    }

    // Return if the bot has the permission
    console.log(botPermissions.has(permission));
    return botPermissions.has(permission);
}