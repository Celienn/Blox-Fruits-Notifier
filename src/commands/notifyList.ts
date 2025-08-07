import UserData, { type IUserData } from "../models/UserData.js";
import emojis from "../utils/getEmojis.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

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

            for (let i = 0; i < usrData.fruits.length; i++) {
                const fruitName = usrData.fruits[i];
                if (!fruitName) continue;

                let emoji = await emojis(client, fruitName);
                usrData.fruits[i] = `${emoji} ${usrData.fruits[i]}`
            }

            const reply = (usrData.fruits.join(', ') == '') ? "Your list is empty" : usrData.fruits.join(', ');
            interaction.reply(reply);
        } catch (error) {
            console.error(`[Command /notifylist]: ${error}`);	
        }
    },
}