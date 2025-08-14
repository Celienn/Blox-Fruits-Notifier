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
        console.log("✅ Connected to Database");

        const token: string | undefined = getToken();

        if (!token) {
            console.error("❌ No token provided. Please set the PROD_TOKEN or DEV_TOKEN environment variable.");
            return;
        }

        eventHandler(client);

        client.login(token);
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