require("dotenv").config()
const { REST, Routes } = require("discord.js");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = () => {
    const commands = getLocalCommands();

    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);
    
    (async () => {
        try{
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            // Splitting test and regular commands into different arrays
            let testCommands = [];
            for (let i = 0 ; i < commands.length ; i++ ) {
                commands[i-testCommands.length] = commands[i];
                if (!commands[i].test) continue;
                testCommands.push(commands[i]);
            }

            for (_ of testCommands) commands.pop();

            // Loading commands
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            )

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);

            if (!testCommands.length) return ;
                
            const test = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.DEFAULT_SERVER),
                { body: testCommands },
            )
    
            console.log(`Successfully reloaded ${test.length} application test (/) commands.`);
        } catch (error) {
            console.log(`Error ==> ${error}`);
        }
    })();
}

