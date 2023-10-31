const UserData = require("../models/UserData");

module.exports = {
    name: 'togglenotify',
    description: 'Toggle notifications',
    callback: async (client, interaction) => {

        // Search in  the data base if an entry already exist for the current user 
        const query = {
            id: interaction.user.id
        }

        try {
            var usrData = await UserData.findOne(query);
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
                console.log(`Error while updating data :${error}`);
                return;
            });
        } catch(error) {
            console.log(`Error: ${error}`)
        }

        const reply = (usrData.notify) ? "Notifications are now enabled" : "Notifications are now disabled";
        interaction.reply(reply);
    },
}