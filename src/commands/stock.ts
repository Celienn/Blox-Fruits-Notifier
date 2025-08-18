import stock from "../utils/stock.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
    name: 'stock',
    description: 'Show the blox fruit dealer\'s current stock',
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            interaction.reply(stock.getUrl());
        } catch (error) {
            console.error(`[Command /stock]: ${error}`);
            interaction.reply({
                content: "An error occurred :c .",
                ephemeral: true,
            });
        }

    },
}