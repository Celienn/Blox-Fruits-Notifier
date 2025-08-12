import { Client, type ChatInputCommandInteraction } from "discord.js";
import emojis from "../utils/emojis.js";
import GuildData from "../models/GuildData.js";
import UserData from "../models/UserData.js";
import { env } from "process";

export default {
    name: 'debug',
    description: 'Command for debugging purposes',
    test: true,
    options: [
        {
            name: 'emojis-get',
            description: 'Get all emojis from the bot',
            type: 1
        },
        {
            name: 'emojis-upload',
            description: 'Upload emojis to the bot',
            type: 1
        },
        {
            name: 'crash',
            description: 'Crash the bot',
            type: 1
        },
        {
            name: 'clear-db',
            description: 'Clear the database',
            type: 1
        }
    ],
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'emojis-get':
                const emojiList = await emojis.getList();
                interaction.reply({
                    content: `Emojis fetched: ${Object.keys(emojiList).length}\n` +
                        Object.values(emojiList)
                            .map(e => `<:${e.name}:${e.id}>`)
                            .join(" ")
                });
                break;
                
            case 'emojis-upload':
                const oldEmojis = await emojis.getList();
                await interaction.deferReply();
                await emojis.uploadAll(client);
                const newEmojis = await emojis.getList();
                const newEmojisCount = Object.keys(newEmojis).length - Object.keys(oldEmojis).length;

                if (newEmojisCount > 0) {
                    const oldEmojiIds = new Set(Object.values(oldEmojis).map(e => String(e.id)));

                    await interaction.editReply({
                        content: `Emojis uploaded: ${newEmojisCount}\n` + Object.values(newEmojis)
                            .filter(e => e.id && !oldEmojiIds.has(String(e.id)))
                            .map(e => `<:${e.name}:${e.id}>`)
                            .join(" ")
                    });
                    break;
                }

                interaction.editReply({
                    content: `No new emojis were uploaded.`
                });
                    
                break;
            
            case 'crash':
                setTimeout(() => {
                    interaction.reply({
                        content: `Crash or g`
                    });
                }, 3000);
                
                break;
            
            case 'clear-db':

                if (process.env["NODE_ENV"] !== "development") {
                    interaction.reply({ content: "you fool", ephemeral: true });
                    return;
                }

                await interaction.deferReply();

                // Clear all guild and user entries
                await GuildData.deleteMany({});
                await UserData.deleteMany({});

                await interaction.editReply({
                    content: `Database cleared.`
                });

                break;

        }
    }
}