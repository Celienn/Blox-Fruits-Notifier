import { REST, Routes, type RESTPostAPIApplicationCommandsResult } from "discord.js";
import getLocalCommands, { type CommandData } from "../../utils/commandUtils.js";
import { APP_TOKEN, APP_ID } from "../../utils/credentials.js";

export default async () => {

    if (!APP_ID) {
        console.error("❌ No Application ID provided. Please set the PROD_APP_ID or DEV_APP_ID environment variable.");
        return;
    }

    const commands = await getLocalCommands();

    const rest = new REST({version: '10'}).setToken(APP_TOKEN!); // trust me bro
    
    // todo add test to verify the client id is valid

    (async () => {
        try{
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            // Splitting test and regular commands into different arrays
            let testCommands: CommandData[] = [];
            let globalCommands: CommandData[] = [];

            for (const command of commands) {
                if (!command) continue;
                (command.test ? testCommands : globalCommands).push(command);
            }

            for (const _ of testCommands) commands.pop();

            // Loading commands
            const data = await rest.put(
                Routes.applicationCommands(APP_ID),
                { body: globalCommands },
            ) as RESTPostAPIApplicationCommandsResult[];

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);

            if (!testCommands.length || typeof process.env["DEFAULT_GUILD"] === undefined) return ;

            const test = await rest.put(
                Routes.applicationGuildCommands(APP_ID, process.env["DEFAULT_GUILD"]!),
                { body: testCommands },
            ) as RESTPostAPIApplicationCommandsResult[];

            console.log(`Successfully reloaded ${test.length} application test (/) commands.`);
        } catch (error) {
            console.error(`[Event register-commands] Error while registering commands: ${error}`);
        }
    })();
}