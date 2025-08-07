import fruits from "../../utils/getDevilsFruitPrice.js";
import { Client } from "discord.js";
import path from 'path';
import getESMPaths from "../../utils/getESMPaths.js";

const { __dirname } = getESMPaths(import.meta.url);

const fruitsNames = Object.keys(fruits);
const folderPath = path.join(__dirname, "../../../ressources/");

export default async (client: Client) => {
    try {
        const guildId = process.env["DEFAULT_GUILD"];

        if (!guildId) {
            throw new Error("DEFAULT_GUILD environment variable is not defined.");
        }

        const guild = await client.guilds.fetch(guildId);

        for (const fruit of fruitsNames) {
            const existingEmoji = guild.emojis.cache.find(emoji => emoji.name === fruit);

            if (existingEmoji) continue;

            await guild.emojis.create({ attachment: folderPath + fruit + ".png", name: fruit })
                .then(emoji => console.log(`Emoji created: ${emoji.name}`))
                .catch(error => console.error(`[Utils uploadEmojis] Error uploading emoji ${fruit}: ${error.message}`));
        
        }
    } catch (error) {
        const err = error as any;
        console.error(`[Utils uploadEmojis] Error while creating emojis: ${err.message}`);
    }
};
