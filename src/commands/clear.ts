import UserData from "../models/UserData.js";
import { Client, type ChatInputCommandInteraction } from "discord.js";

export default {
    name: 'clear',
    description: 'Clear your notify list',
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {

        // Search in  the data base if an entry already exist for the current user 
        const query = {
            id: interaction.user.id
        }

        try {
            let usrData = await UserData.findOne(query);

            if (!usrData) {
                interaction.reply("Your notify list is already empty."); 
                return;
            }

            // Remove the fruits from the user data
            usrData.fruits = []

            // Save the new data to the data base
            await usrData.save().catch((error) => {
                console.log(`[Command /clear] Error while updating data :${error}`);
                return;
            });
            
        } catch(error) {
            console.error(`[Command /clear]: ${error}`)
        }
        
        interaction.reply({
            content: "Your notify list was cleared.",
            ephemeral: true,
        });
    },
}