import { StringSelectMenuBuilder, ButtonStyle, ButtonBuilder, ContainerBuilder, StringSelectMenuOptionBuilder, Client, type ChatInputCommandInteraction, MessageFlags, MessageComponentInteraction } from "discord.js";
import UserData from "../models/UserData.js";
import fruits, { type Fruit, Rarity } from "../utils/fruits.js";
import emojis from "../utils/emojis.js";

const fruitList: Fruit[] = fruits.list();
fruitList.reverse();

var choices: Record<Rarity,StringSelectMenuOptionBuilder[]> = {
    [Rarity.Common]: [],
    [Rarity.Uncommon]: [],
    [Rarity.Rare]: [],
    [Rarity.Legendary]: [],
    [Rarity.Mythical]: [],
};

const rarityMsg: Record<Rarity, string> = {
    [Rarity.Common] : 'ansi\n\u001b[2;37m',
    [Rarity.Uncommon] : 'ansi\n\u001b[2;34m',
    [Rarity.Rare] : 'ansi\n\u001b[2;35m',
    [Rarity.Legendary] : 'prolog\n',
    [Rarity.Mythical] : 'ansi\n\u001b[2;31m',
}

let initialized = false;
export function initChoices() {
    if (initialized) return;

    for (const fruit of fruitList) {
        let name = fruit.name;
        let emoji = emojis.get(name.toLowerCase());

        if (!emoji || name === 'Rocket' || name === 'Spin') continue;
        
        let rarity = fruit.rarity;

        choices[rarity].push(new StringSelectMenuOptionBuilder()
            .setLabel(name)
            .setValue(name.toLowerCase())
            .setEmoji(emoji.id)
        );
    }
    initialized = true;
    return choices;
}

const generateSelectMenu = (id: string, choices: StringSelectMenuOptionBuilder[]) : StringSelectMenuBuilder => {
    const select = new StringSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder('No fruits selected.')
        .setMinValues(0)
        .setMaxValues(choices.length) // 25 is the max
        .addOptions(choices);
        
    return select;
};


export default {
    name: 'add-v2',
    description: 'Be notified when a fruit is in stock',
    callback: async (client: Client, interaction: ChatInputCommandInteraction) : Promise<void> => {

        await interaction.deferReply(); // Initializing emojis might take a while
        
        if (!initialized) { // this should never be true , but just in case
            interaction.reply({ content: "The app is booting, please try again later.", ephemeral: true });
            return;
        }

        const customChoices: Record<Rarity, StringSelectMenuOptionBuilder[]> = {} as any;
        let container: ContainerBuilder = new ContainerBuilder();

        const query = {
            id: interaction.user.id
        }

        let usrData;
        try {
            usrData = await UserData.findOne(query);
            if (!usrData || !usrData.fruits) {
                // If no user data found, create a new entry with an empty fruits array
                usrData = new UserData({
                    id: interaction.user.id,
                    fruits: [],
                });
            }

            // TODO: Optimized by filtering user data by rarity.
            // Currently, we iterate through every rarity list (common, rare, etc.) and check all user fruits each time.
            // If the user's fruits were also grouped by rarity, we could directly iterate only the relevant lists,
            // skip unnecessary ones (e.g., if the user has no "common" fruits), and reduce the number of iterations.

            // Set default values for the select menu based on user data
            for (const rarity of Object.values(Rarity) as Rarity[]) { 
                if (!choices[rarity]) continue;
                customChoices[rarity] = [];
                let tempUsrData = usrData.$clone();

                for (const choice of choices[rarity]) {
                    
                    for (let i = tempUsrData.fruits.length - 1; i >= 0; i--) {
                        const dataFruitName = tempUsrData.fruits[i];

                        choice.setDefault(false);
                        if (choice.data.value === dataFruitName) {
                            choice.setDefault(true);
                            tempUsrData.fruits.splice(i, 1); // Remove the fruit from array for optimisation purpose
                            break;
                        };

                    }
                    customChoices[rarity].push(choice);

                }

                const color = rarityMsg[rarity];
                const rarityStr = rarity.toLocaleString().slice(0, 1).toUpperCase() + rarity.toLocaleString().slice(1);

                container.addTextDisplayComponents(td => td.setContent("```" + color + rarityStr + " Fruits```"))
                container.addActionRowComponents(row => {
                        row.addComponents(generateSelectMenu(`${rarity}`, customChoices[rarity] ?? [] /* typescript :D */) );
                        return row;
                    })
                container.addSeparatorComponents(sep => sep.setDivider(true));

                if (rarity === Rarity.Mythical) {
                    container.addActionRowComponents(row => {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`confirm`)
                                .setLabel("Confirm")
                                .setStyle(ButtonStyle.Success)
                        );
                    
                        return row;
                    })
                }
                
            }
        } catch (error) {
            console.error(`[Command /add] Error while loading default choices: ${error}`);
            if (!interaction) throw error;
            interaction.editReply({ content: "An error occurred." });
            return;
        }
        
        const response = await interaction.editReply({
            components: [container], // ? Feel like it look better with a single container
            flags: MessageFlags.IsComponentsV2
        });

        const collector = response.createMessageComponentCollector({
            filter: (i: MessageComponentInteraction) => i.user.id === interaction.user.id,
            time: 60000
        });

        collector.on('collect', async (i: MessageComponentInteraction) => {
            if (i.isStringSelectMenu()) {
                // Add selected fruits to the user data
                // ! this is temporary code , until i change the database structure
                const rarity = i.customId;
                const newData = i.values;
                for(const fruitName of usrData.fruits) {
                    const fruit = fruits.get(fruitName.toLowerCase());
                    if (!fruit) continue; 
                    if (fruit.rarity.toLocaleString() !== rarity) continue;
                    // remove fruit from usrData
                    usrData.fruits.splice(usrData.fruits.indexOf(fruitName), 1);
                }
                usrData.fruits.push(...newData);
                
                await i.deferUpdate();
            }

            if (i.customId === 'confirm' && i.isButton()) {
                collector.stop();

                // Save the new data to the database
                await usrData.save().catch((error) => {
                    console.error(`[Command /add] Error while updating data :${error}`);
                    return;
                });

                console.log(`[Command /add] User ${interaction.user.tag} updated their fruit list: ${JSON.stringify(usrData.fruits)}`);

                await i.update({
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(td => td.setContent("```ansi\n\u001b[2;32mChanges saved successfully.\n```"))
                    ],
                    flags: MessageFlags.IsComponentsV2
                });
            }
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                await interaction.followUp({ content: 'You took too long to respond!', ephemeral: true });
            }
        });
    },
}