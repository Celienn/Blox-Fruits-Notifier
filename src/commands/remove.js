const { ApplicationCommandOptionType } = require("discord.js");
const UserData = require("../models/UserData");

const fruits = require("../utils/getDevilsFruitPrice")();
const fruitsNames = Object.keys(fruits);
const excludeList = "chop,spring,bomb,smoke,flame,ice,sand,dark,revive,diamond"
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
    name: 'remove',
    description: 'Remove a fruit from your notify list',
    options: [
        {
            name: 'fruit',
            description: 'devil fruit you want to stop being notified',
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
            userId: interaction.user.id
        }

        try {
            var usrData = await UserData.findOne(query);
            if (!usrData) {
                interaction.reply("You didn't hava added any fruit yet."); 
                return;
            }

            // Search if the fruit is in the user data
            const fruitIndex = usrData.fruits.indexOf(fruit);
            console.log(fruitIndex)
            if (fruitIndex == -1) {
                interaction.reply(`${fruit} isn't in your notify list.`);
                return;
            }

            // Remove the fruit from the user date
            usrData.fruits.splice(fruitIndex,1);

            // Save the new data to the data base
            await usrData.save().catch((error) => {
                console.log(`Error while updating data :${error}`);
                return;
            });
        } catch(error) {
            console.log(`Error: ${error}`)
        }

        interaction.reply(usrData.fruits.join(', '));
    },
}