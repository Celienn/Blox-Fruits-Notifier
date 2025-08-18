import {Client, IntentsBitField} from "discord.js";
import mongoose from "mongoose";
import eventHandler from "./handlers/eventHandlers.js";
import { APP_TOKEN, DB_URI } from "./utils/credentials.js";

const client: Client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages
    ]
});

export default client;

(async () => {
    try{

        if (!DB_URI) {
            console.error("❌ No MongoDB URI provided. Please set the PROD_URI or DEV_URI environment variable.");
            return;
        }

        mongoose.set('strictQuery', false);
        await mongoose.connect(DB_URI);
        console.log("✅ Connected to Database");

        if (!APP_TOKEN) {
            console.error("❌ No token provided. Please set the PROD_TOKEN or DEV_TOKEN environment variable.");
            return;
        }

        eventHandler(client);

        client.login(APP_TOKEN);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error : ${error.message}`);
        } else {
            console.error(`Error : ${String(error)}`);
        }
    }
})();


// ! don't 
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});