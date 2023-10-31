const UserData = require("../models/UserData");

module.exports = {
    name: 'clear',
    description: 'Clear your notify list',
    callback: async (client, interaction) => {

        // Search in  the data base if an entry already exist for the current user 
        const query = {
            id: interaction.user.id
        }

        try {
            var usrData = await UserData.findOne(query);
            if (!usrData) {
                interaction.reply("Your notify list is already empty."); 
                return;
            }

            // Remove the fruit from the user date
            usrData.fruits = []

            // Save the new data to the data base
            await usrData.save().catch((error) => {
                console.log(`Error while updating data :${error}`);
                return;
            });
        } catch(error) {
            console.log(`Error: ${error}`)
        }
        
        interaction.reply("Done.");
    },
}