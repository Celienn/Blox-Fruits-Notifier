import dotenv from 'dotenv';
import { REST, Routes, type RESTPostAPIApplicationCommandsResult } from "discord.js";
import getLocalCommands, { type CommandStruct } from "../../utils/commandUtils.js";
import getToken from "../../utils/getToken.js";

dotenv.config();
// todo finish converting to ESM
export default async () => {
    const commands = await getLocalCommands();

    const rest = new REST({version: '10'}).setToken(getToken()!); // trust me bro
    
    // todo add test to verify the client id is set and valid
    const CLIENT_ID = (process.env["NODE_ENV"] === "production") ?
        process.env["PROD_CLIENT_ID"]! :
        process.env["DEV_CLIENT_ID"]!;

    (async () => {
        try{
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            // Splitting test and regular commands into different arrays
            let testCommands: CommandStruct[] = [];
            let globalCommands: CommandStruct[] = [];

            for (const command of commands) {
                if (!command) continue;
                (command.test ? testCommands : globalCommands).push(command);
            }

            for (const _ of testCommands) commands.pop();

            // Loading commands
            const data = await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: globalCommands },
            ) as RESTPostAPIApplicationCommandsResult[];

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);

            if (!testCommands.length || typeof process.env["DEFAULT_GUILD"] === undefined) return ;

            const test = await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, process.env["DEFAULT_GUILD"]!),
                { body: testCommands },
            ) as RESTPostAPIApplicationCommandsResult[];

            console.log(`Successfully reloaded ${test.length} application test (/) commands.`);
        } catch (error) {
            console.log(`[Event register-commands] Error while registering commands: ${error}`);
        }
    })();
}