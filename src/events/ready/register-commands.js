require("dotenv").config()
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = () => {
    const commands = getLocalCommands();

    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);
    
    (async () => {
        try{
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            )
    
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.log(`Error ==> ${error}`);
        }
    })();
}

