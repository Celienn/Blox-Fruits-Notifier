import UserData, { type IUserData } from "../models/UserData.js";
import emojis from "../utils/emojis.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

// todo make it show weather or not the notification are enabled or not
export default {
    name: 'notifylist',
    description: 'Show your notify list',
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {

        const query = {
            id: interaction.user.id
        }
        
        try {
            let usrData: IUserData | null = await UserData.findOne(query);
            
            if (!usrData || !usrData.fruits) return; // ! not good

            let emojiList = await emojis.getList();

            usrData.fruits = usrData.fruits
                .filter(Boolean)
                .map(fruitName => `<:name:${emojiList[fruitName]?.id || ''}> ${fruitName}`.trim());

            const reply = (usrData.fruits.join(', ') == '') ? "Your list is empty" : usrData.fruits.join(', ');
            interaction.reply(reply);
        } catch (error) {
            console.error(`[Command /notifylist]: ${error}`);	
            interaction.reply({
                content: "An error occurred while fetching your notify list.",
                ephemeral: true,
            });
        }
    },
}