const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const UserData = require("../models/UserData");
const fruits = require("../utils/getDevilsFruitPrice");
const emojis = require("../utils/getEmojis");

const excludeList = process.env.EXCLUDE_FRUITS
const fruitsNames = Object.keys(fruits);
var choices = []

for (const fruit of fruitsNames) {
    if (excludeList.includes(fruit)) continue
    choices.push(
        new StringSelectMenuOptionBuilder()
            .setLabel(fruit.charAt(0).toUpperCase() + fruit.slice(1))
            .setValue(fruit)
    );
}

choices.reverse();

const generateSelectMenu = (customChoices) => {
    const select = new StringSelectMenuBuilder()
        .setCustomId('addfruits')
        .setPlaceholder('Your list is empty.')
        .setMinValues(1)
        .setMaxValues(choices.length)
        .addOptions(customChoices);

    const row = new ActionRowBuilder().addComponents(select);
    return { select, row };
};

module.exports = {
    name: 'add',
    description: 'Be notified when a fruit is in stock',
    callback: async (client, interaction) => {
        
        const customChoices = choices;

        const query = {
            id: interaction.user.id
        }
        
        try {
            var usrData = await UserData.findOne(query);
            if (!usrData || !usrData.fruits) return;

            for (let i = 0 ; i < choices.length ; i++) {    
                let emoji = await emojis(client,choices[i].toJSON().label.toLowerCase());
                customChoices[i].setEmoji(emoji.id);
                for (const dataFruit of usrData.fruits) {
                    if (choices[i].toJSON().label.toLowerCase() != dataFruit) continue;
                    customChoices[i].setDefault(true);
                    break;
                }
            }
        } catch (error) {
            console.error(`[Command /add] Error while loading default choices: ${error}`);
            if (!interaction) throw error;
            interaction.reply({ content: "An error occurred.", ephemeral: true });
        }

        const { select, row } = generateSelectMenu(customChoices);

        const response = await interaction.reply({
            content: '\ ',
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try{
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter });

            if (confirmation.customId === 'addfruits') {
                // Search in  the data base if an entry already exist for the current user 
                const query = {
                    id: interaction.user.id
                }

                var usrData = await UserData.findOne(query);

                if (usrData) {
                    // Add selected fruits to the user data 
                    usrData.fruits = confirmation.values;

                }else {
                    // Create an entry for the user in the data base
                    usrData = new UserData({
                        id: interaction.user.id,
                        fruits: confirmation.values,
                    });
                }
                // Save the new data to the data base
                await usrData.save().catch((error) => {
                    console.log(`[Command /add] Error while updating data :${error}`);
                    return;
                });

                await confirmation.update('\ ');


                response.edit({
                    content: 'Changes saved',
                    components: [],
                });
                confirmation.message.react('✅');
            }
        } catch (error) {
            console.error(`[Command /add]: ${error}`);
            interaction.reply({ content: "An error occurred.", ephemeral: true });
        }
    },
}