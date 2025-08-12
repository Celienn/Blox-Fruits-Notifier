import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type StringSelectMenuInteraction , Client, type ChatInputCommandInteraction, BaseInteraction, CommandInteractionOptionResolver } from "discord.js";
import UserData from "../models/UserData.js";
import fruits from "../utils/fruits.js";
import emojis from "../utils/emojis.js";

const excludeList: string[] = process.env["EXCLUDE_FRUITS"]?.split(",") || [];
const fruitsNames: string[] = Object.keys(fruits);
var choices: StringSelectMenuOptionBuilder[] = [];

let initialized = false;
export function initChoices() {
    if (initialized) return;

    for (const fruit of fruitsNames) {
        let label = fruit.charAt(0).toUpperCase() + fruit.slice(1);
        let emoji = emojis.get(label.toLowerCase());

        if (!emoji || !fruits[fruit] || excludeList.includes(fruit)) continue;

        choices.push(new StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(fruit)
            .setEmoji(emoji.id)
        );
    }
    initialized = true;
    choices.reverse();
    return choices;
}


const generateSelectMenu = (customChoices: StringSelectMenuOptionBuilder[]) : { select: StringSelectMenuBuilder, row: ActionRowBuilder } => {
    const select = new StringSelectMenuBuilder()
        .setCustomId('addfruits')
        .setPlaceholder('Your list is empty.')
        .setMinValues(1)
        .setMaxValues(customChoices.length)
        .addOptions(customChoices);

    const row = new ActionRowBuilder().addComponents(select);
    return { select, row };
};

export default {
    name: 'add',
    description: 'Be notified when a fruit is in stock',
    callback: async (client: Client, interaction: ChatInputCommandInteraction) : Promise<void> => {
        
        const defaultChoices = choices.slice(); // todo check if it is even needed

        if (!initialized) {
            await emojis.init();
            initChoices();
        }

        const query = {
            id: interaction.user.id
        }
        
        try {
            let usrData = await UserData.findOne(query);
            if (!usrData || !usrData.fruits) {
                // If no user data found, create a new entry with an empty fruits array
                usrData = new UserData({
                    id: interaction.user.id,
                    fruits: [],
                });
            }

            // Set default values for the select menu based on user data
            for (const choice of defaultChoices) {
                if (!choice) continue;
                
                for (const dataFruit of usrData.fruits) {
                    if (choice.toJSON().label.toLowerCase() != dataFruit) continue;
                    choice.setDefault(true);
                    break;
                }
            }
        } catch (error) {
            console.error(`[Command /add] Error while loading default choices: ${error}`);
            if (!interaction) throw error;
            interaction.reply({ content: "An error occurred.", ephemeral: true });
        }

        const { row } = generateSelectMenu(defaultChoices);

        const response = await interaction.reply({
            content: '\ ',
            components: [row.toJSON()],
        });

        const collectorFilter = (i: BaseInteraction) => {
            return i.user.id === interaction.user.id && i.isStringSelectMenu();
        };

        try{
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter });

            if (confirmation.customId === 'addfruits' && confirmation.isStringSelectMenu()) {
                // Search in  the data base if an entry already exist for the current user 
                const query = {
                    id: interaction.user.id
                }

                let usrData = await UserData.findOne(query);

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
                    console.error(`[Command /add] Error while updating data :${error}`);
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