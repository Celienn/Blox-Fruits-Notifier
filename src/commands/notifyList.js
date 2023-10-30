const UserData = require("../models/UserData");

module.exports = {
    name: 'notifylist',
    description: 'Show your notify list',
    callback: async (client, interaction) => {

        const query = {
            id: interaction.user.id
        }
        
        try {
            var usrData = await UserData.findOne(query);
            if (!usrData || !usrData.fruits) return;

            const reply = (usrData.fruits.join(', ') == '') ? "Your list is empty" : usrData.fruits.join(', ');
            interaction.reply(reply);
        } catch (error) {
            console.log(error);
        }

    },
}