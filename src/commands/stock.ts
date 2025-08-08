import stock from "../utils/getCurrentStock.js";
import stockImg from "../utils/generateStockImg.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
    name: 'stock',
    description: 'Show the blox fruit dealer\'s current stock',
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            const stockArr = await stock();
            const imgBuffer = await stockImg(stockArr);
            
            interaction.reply({ files: [{ attachment: imgBuffer, name: 'stock.png' }] });
        } catch (error) {
            console.log(`[Command /stock]: ${error}`);
        }

    },
}