import { Client, type ChatInputCommandInteraction, GuildChannel } from "discord.js";
import getLocalCommands from "../../utils/commandUtils.js";
import hasPermissions from "../../utils/checkBotPermissions.js";

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

        if (interaction.channel?.type == 0 && commandObject.requiredPermissions && await hasPermissions(client, interaction.channel as GuildChannel, commandObject.requiredPermissions) === false) {
            console.warn(`[Command Handler] Insufficient permissions to use /${interaction.commandName} command in ${interaction.channel.id}.`);
            console.log(await hasPermissions(client, interaction.channel as GuildChannel, commandObject.requiredPermissions))
            safeReply(interaction, "The bot requires " + commandObject.requiredPermissions.join(", ") + " permissions to execute this command.");
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