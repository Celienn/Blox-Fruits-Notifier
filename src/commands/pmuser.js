module.exports = {
    name: 'pmuser',
    description: 'Send a private message to a user',
    test: true,
    default_member_permissions: "0",
    options: [
        {
            name: 'user',
            description: 'The user to send the message to',
            type: 6,
            required: true
        
        },
        {
            name: 'message',
            description: 'The message to send',
            type: 3,
            required: true,
            min_length: 1
        }

    ],
    callback: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');
        user.send(message);
        interaction.reply(`Message sent to ${user.tag}`);    
    }
}