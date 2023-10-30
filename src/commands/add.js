const { ApplicationCommandOptionType } = require("discord.js");
const UserData = require("../models/UserData");

const fruits = require("../utils/getDevilsFruitPrice");
const fruitsNames = Object.keys(fruits);
const excludeList = "chop,spring,bomb,smoke,spike,flame,falcon,sand,revive,diamond"
const choices = []

for (const fruit of fruitsNames) {
    if (excludeList.includes(fruit)) continue
    choices.push({
        name: fruit.charAt(0).toUpperCase() + fruit.slice(1),
        value: fruit,
    })
}

choices.reverse();

module.exports = {
    name: 'add',
    description: 'Be notified when a fruit is in stock',
    options: [
        {
            name: 'fruit',
            description: 'devil fruit you want to be notified of when it will be in stock',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: choices,
        }
    ],
    callback: async (client, interaction) => {
        const fruit = interaction.options.get("fruit").value;
        if (!fruit) return;

        // Search in  the data base if an entry already exist for the current user 
        const query = {
            id: interaction.user.id
        }

        try {
            var usrData = await UserData.findOne(query);

            if (usrData) {
                for (usrFruit of usrData.fruits) {
                    if (usrFruit == fruit) {
                        interaction.reply("Fruit already added to your notify list");
                        return;
                    }
                }
                // Add the new fruit to the user data 
                usrData.fruits.push(fruit);

            }else {
                // Create an entry for the user in the data base
                usrData = new UserData({
                    id: interaction.user.id,
                    fruits: [fruit],
                })
            }
            // Save the new data to the data base
            await usrData.save().catch((error) => {
                console.log(`Error while updating data :${error}`);
                return;
            });
        } catch(error) {
            console.log(`Error: ${error}`)
        }
        
        const reply = (usrData.fruits.join(', ') == '') ? "Your list is empty" : usrData.fruits.join(', ');
        interaction.reply(reply);
    },
}