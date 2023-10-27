require('dotenv').config()
const {Client, IntentsBitField} = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandlers");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

(async () => {
    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to Database.");

        eventHandler(client);
        
        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`Error : ${error}`);
    }
})();

