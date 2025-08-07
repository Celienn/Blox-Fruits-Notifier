import dotenv from 'dotenv';
import {Client, IntentsBitField} from "discord.js";
import mongoose from "mongoose";
import eventHandler from "./handlers/eventHandlers.js";
import getToken from "./utils/getToken.js";

dotenv.config();

const client: Client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages
    ]
});

export default client;

/* 
   todo list
 * 1) switch to typescript 
 * 2) use bot emojis 
 * 3) setup user bot / user application 
 * 4) add units test
 * 5) make it so you can actually add any fruit to the notify list
 * 6) improve logs
 * 7) add help command or an easy way for people to know who / where to go when there is an issue with the bot
 * 8) clean my trash code ( use lower camel case for var and func , but camel case for classes , types , interface , etc ...) , add more comments, etc...
*/
(async () => {
    try{

        const uri: string | undefined = process.env["NODE_ENV"] === "production"
          ? process.env["PROD_URI"]
          : process.env["DEV_URI"];

        if (!uri) {
            console.error("❌ No MongoDB URI provided. Please set the PROD_URI or DEV_URI environment variable.");
            return;
        }

        mongoose.set('strictQuery', false);
        await mongoose.connect(uri);
        console.log("✅ Connected to Database.");

        const token: string | undefined = getToken();

        if (!token) {
            console.error("❌ No token provided. Please set the PROD_TOKEN or DEV_TOKEN environment variable.");
            return;
        }

        eventHandler(client);

        client.login(token);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(`Error : ${error.message}`);
        } else {
            console.log(`Error : ${String(error)}`);
        }
    }
})();