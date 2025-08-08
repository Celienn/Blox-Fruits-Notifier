import axios from "axios";
import fruits from "./getDevilsFruitPrice.js";
import { Client, GuildEmoji } from "discord.js";
import path from 'path';
import getESMPaths from "./getESMPaths.js";

const APP_ID = (process.env["NODE_ENV"] === "production") ?
    process.env["PROD_APP_ID"]! :
    process.env["DEV_APP_ID"]!;
const APP_TOKEN = (process.env["NODE_ENV"] === "production") ?
    process.env["PROD_TOKEN"]! :
    process.env["DEV_TOKEN"]!;
const fruitsNames = Object.keys(fruits);
const { __dirname } = getESMPaths(import.meta.url);
const folderPath = path.join(__dirname, "../../ressources/");

export default {
    uploadAll: async function (client: Client) {
        if (!client.application) throw new Error("Client application is not available.");
        
        const emojis = await this.getList();
        for (const fruit of fruitsNames) {9
            const existingEmoji = emojis[fruit];

            if (existingEmoji) continue;

            await client.application.emojis.create({ attachment: folderPath + fruit + ".png", name: fruit })
                .then(emoji => console.log(`Emoji created: ${emoji.name}`))
                .catch(error => console.error(`[Utils uploadEmojis] Error uploading emoji ${fruit}: ${error.message}`));
        
        }
    },
    // todo use discord.js ApplicationEmojiManager
    getList: async (): Promise<Record<string, GuildEmoji>> => {
        const response = await axios.get(
            `https://discord.com/api/v10/applications/${APP_ID}/emojis`,
            {
                headers: {
                    "Authorization": `Bot ${APP_TOKEN}`
                }
            }
        ).catch((error) => {
            console.error(`[Function getEmojis]: ${error}`);
        });

        if (!response || !response.data) return {};

        let emojis: Record<string, GuildEmoji> = {};
        let items = response.data.items;

        emojis = Object.fromEntries(
            items.filter((emoji: GuildEmoji) => emoji.name).map((emoji: GuildEmoji) => [emoji.name, emoji])
        );

        return emojis;
    },
    get: async function (emojiName: string): Promise<GuildEmoji | undefined> {
        const emojis = await this.getList();
        return emojis[emojiName];
    }
};
