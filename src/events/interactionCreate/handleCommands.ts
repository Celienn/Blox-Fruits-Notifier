import { Client, type ChatInputCommandInteraction } from "discord.js";
import getLocalCommands from "../../utils/commandUtils.js";

const localCommands = await getLocalCommands();

export default async (client: Client, interaction: ChatInputCommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );
        
        if (!commandObject) {
            console.warn(`[Command Handler] Command "${interaction.commandName}" not found.`);
            return;
        }
        
        // TODO check if the bot have the required permissions to execute the command
        await commandObject.callback(client,interaction);
    } catch(error) {
        console.log(`[Command Handler]: ${error}`);
    }
};