import UserData from "../models/UserData.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
    name: 'togglenotify',
    description: 'Toggle notifications',
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {

        // Search in  the data base if an entry already exist for the current user 
        const query = {
            id: interaction.user.id
        }

        let usrData;
        
        usrData = await UserData.findOne(query);
        if (!usrData) {
            usrData = new UserData({
                id: interaction.user.id,
                fruits: [],
                notify: false,
            });
        }

        usrData.notify = (!usrData.notify);

        // Save the new data to the data base
        await usrData.save().catch((error) => {
            console.error(`[Command /togglenotify] Error while updating data :${error}`);
            return;
        });

        const reply = (usrData.notify) ? "Notifications are now enabled" : "Notifications are now disabled";
        interaction.reply({
            ephemeral: true,
            content: reply
        });
    },
}