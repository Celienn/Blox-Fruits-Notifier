import { Client, type ChatInputCommandInteraction } from "discord.js";
import getLocalCommands from "../../utils/commandUtils.js";

const localCommands = await getLocalCommands();



async function safeReply(interaction: ChatInputCommandInteraction, content: string) {
    try {
        if ((interaction as any)._replied || (interaction as any).deferred) {
            //await interaction.editReply({ content, components: [] }); // might not work if the original interaction use ComponentsV2
        } else {
            await interaction.reply({ content, ephemeral: true });
        }
    } catch (err) {
        console.error(`[Command Handler] Error replying to interaction: ${err}`);
    }
}

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
        console.log(`${interaction.user.tag} used /${interaction.commandName} command`);
        await commandObject.callback(client,interaction);
    } catch(error) {
        console.error(`[Command Handler]: ${error}`);
        safeReply(interaction, "An unexpected error occurred.");
    }
};