import stock from "../utils/stock.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
    name: 'stock',
    description: 'Show the blox fruit dealer\'s current stock',
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            const imgUrl = stock.getUrl();
            if (imgUrl) {
                interaction.reply(imgUrl);
            }else {
                const attachment = 
                    {
                        attachment: await stock.genImg(),
                        name:'image.png'
                    };
                const reply = await interaction.reply({ files: [attachment] });
                stock.setUrl( (await reply.awaitMessageComponent()).message.attachments.first()?.url );
            }
        } catch (error) {
            console.error(`[Command /stock]: ${error}`);
            interaction.reply({
                content: "An error occurred :c .",
                ephemeral: true,
            });
        }

    },
}