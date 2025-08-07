import { Client, type ChatInputCommandInteraction } from "discord.js";

export default {
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
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');

        if (!user) {
            interaction.reply({ content: 'An error occurred while fetching the user.', ephemeral: true });
            return;
        }

        if (!message) {
            interaction.reply({ content: 'Please provide a message to send.', ephemeral: true });
            return;
        } 

        user.send(message);
        interaction.reply(`Message sent to ${user.tag}`);    
    }
}