import path from "path";
import getAllFiles from "./getAllFiles.js";
import getESMPaths from "./getESMPaths.js";
import { Client, type ChatInputCommandInteraction } from "discord.js";

const { __dirname } = getESMPaths(import.meta.url);

export enum CommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
    PRIMARY_ENTRY_POINT = 4
}

export enum CommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11
}

export type CommandOptionChoiceStruct = {
    name: string;
    name_localizations?: Record<string, string>;
    value: string | number;
}

export enum IntegrationType {
    GUILD_INSTALL = 0,
    USER_INSTALL = 1
}

export enum InteractionContextType {
    GUILD = 1,
    BOT_DM = 2,
    PRIVATE_CHANNEL = 3
}

export enum HandlerType {
    APP_HANDLER = 1,
    DISCORD_LAUNCH_ACTIVITY = 2
}

export enum ChannelType {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_ANNOUNCEMENT = 5,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15,
    GUILD_MEDIA = 16
}

export type CommandOption = {
    type: CommandOptionType;
    name: string;
    name_localizations?: Record<string, string>;
    description: string;
    description_localizations?: Record<string, string>;
    required?: boolean;
    choices?: CommandOptionChoiceStruct[];
    channel_types?: ChannelType[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
    options?: CommandOption[];
}

export type CommandStruct = 
    {
        type?: CommandType;
        name: string;
        name_localizations? : Record<string, string>;
        description: string;
        description_localizations? : Record<string, string>;
        options?: CommandOption[];
        default_member_permissions?: string;
        default_permission?: boolean; // Will soon be deprecated
        nsfw?: boolean;
        test?: boolean;
        integration_types?: IntegrationType[];
        contexts?: InteractionContextType;
        handlers?: HandlerType;
        callback: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void>;
    }

export default async function getLocalCommands() {
    let localCommands: CommandStruct[] = [];
    
    const commandDir: string = path.join(__dirname,"..","commands");
    const commandFiles: string[] = getAllFiles(commandDir);

    // todo can be optimized by loading them in parallel
    for (const commandFile of commandFiles) {
        const module = await import(commandFile);
        const command: CommandStruct = module.default || module;

        // Todo add unit test as well
        if (!command.name || !command.description || !command.callback) {
            console.warn(`[getLocalCommands] Command in file ${commandFile} is missing required properties.`);
            continue;
        }

        localCommands.push(command);
    }

    return localCommands;
};