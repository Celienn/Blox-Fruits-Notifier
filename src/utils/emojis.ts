import axios from "axios";
import fruits from "./fruits.js";
import { ApplicationEmoji, Client } from "discord.js";
import path from 'path';
import getESMPaths from "./getESMPaths.js";
import { APP_TOKEN, APP_ID } from "./credentials.js";

const fruitList = fruits.list();
const { __dirname } = getESMPaths(import.meta.url);
const folderPath = path.join(__dirname, "../../ressources/");

let emojiCache: Record<string, ApplicationEmoji> = {};

export default {
    init: async function () {
        emojiCache = await this.getList();
    },  
    uploadAll: async function (client: Client) {
        if (!client.application) throw new Error("Client application is not available.");
        
        for (const fruit of fruitList) {
            const name = fruit.name.toLowerCase();
            const existingEmoji = emojiCache[name];

            if (existingEmoji) continue;

            await client.application.emojis.create({ attachment: folderPath + name + ".png", name: name })
                .then(emoji => {
                    console.log(`Emoji created: ${emoji.name}`);
                    emojiCache[name] = emoji;
                })
                .catch(error => console.error(`[Utils uploadEmojis] Error uploading emoji ${name}: ${error.message}`));
        }
    },
    // todo use discord.js ApplicationEmojiManager
    getList: async (): Promise<Record<string, ApplicationEmoji>> => {
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

        let emojis: Record<string, ApplicationEmoji> = {};
        let items = response.data.items;

        emojis = Object.fromEntries(
            items.filter((emoji: ApplicationEmoji) => emoji.name).map((emoji: ApplicationEmoji) => [emoji.name, emoji])
        );

        return emojis;
    },
    get: (emojiName: string): ApplicationEmoji | undefined => {
        return emojiCache[emojiName];
    }
};
