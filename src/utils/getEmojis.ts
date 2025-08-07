import fruits from "./getDevilsFruitPrice.js";
import { Client, GuildEmoji } from "discord.js";

const fruitsNames = Object.keys(fruits);
let emojiArray: Record<string, GuildEmoji> = {};

// todo use bot emoji instead
export default async (client: Client, emojiName: string) => {

    if (Object.keys(emojiArray).length == 0){
        const guild = await client.guilds.fetch(process.env["DEFAULT_GUILD"] || "");

        for (const fruit of fruitsNames) {
            const emoji = guild.emojis.cache.find(e => e.name === fruit);

            if (!emoji) {
                console.error(`Emoji for fruit ${fruit} not found.`);
                continue;
            }

            emojiArray[fruit] = emoji; 
        }
    }
    return emojiArray[emojiName];
}
