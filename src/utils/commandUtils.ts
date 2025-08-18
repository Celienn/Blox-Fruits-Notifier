import path from "path";
import getAllFiles from "./getAllFiles.js";
import getESMPaths from "./getESMPaths.js";
import { Client, type ChatInputCommandInteraction, type ApplicationCommandData, type PermissionsString } from "discord.js";

const { __dirname } = getESMPaths(import.meta.url);

// ? Make it so "requiredPermissions" work on sub commands
export type CommandData = ApplicationCommandData & {
    description: string;
    test?: boolean;
    requiredPermissions?: PermissionsString[];
    callback: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void>;
}

export default async function getLocalCommands() {
    let localCommands: CommandData[] = [];
    
    const commandDir: string = path.join(__dirname,"..","commands");
    const commandFiles: string[] = getAllFiles(commandDir);

    // todo can be optimized by loading them in parallel
    for (const commandFile of commandFiles) {
        const module = await import(commandFile);
        const command: CommandData = module.default || module;

        // Todo add unit test as well
        if (!command.name || !command.description || !command.callback) {
            console.warn(`[getLocalCommands] Command in file ${commandFile} is missing required properties.`);
            continue;
        }

        localCommands.push(command);
    }

    return localCommands;
};