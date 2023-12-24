const UserData = require("../models/UserData");
const emojis = require("../utils/getEmojis");

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

            for(let i = 0 ; i < usrData.fruits.length ; i++) {
                let emoji = await emojis(client,usrData.fruits[i]);
                usrData.fruits[i] = `${emoji} ${usrData.fruits[i]}`
            }

            const reply = (usrData.fruits.join(', ') == '') ? "Your list is empty" : usrData.fruits.join(', ');
            interaction.reply(reply);
        } catch (error) {
            console.error(error);
        }
    },
}