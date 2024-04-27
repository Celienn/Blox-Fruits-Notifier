const fruits = require("../../utils/getDevilsFruitPrice");
const fs = require('fs');
const path = require('path');

const fruitsNames = Object.keys(fruits);
const folderPath = path.join(__dirname, "../../../ressources/images/");

module.exports = async (client) => {
    try {
        const guild = await client.guilds.fetch(process.env.DEFAULT_GUILD);

        for (const fruit of fruitsNames) {
            const existingEmoji = guild.emojis.cache.find(emoji => emoji.name === fruit);

            if (existingEmoji) continue;

            await guild.emojis.create({ attachment: folderPath + fruit + ".png", name: fruit })
                .then(emoji => console.log(`Emoji created: ${emoji.name}`))
                .catch(error => console.error(`[Utils uploadEmojis] Error uploading emoji ${fruit}: ${error.message}`));
        
        }
    } catch (error) {
        console.error(`[Utils uploadEmojis] Error while creating emojis: ${error.message}`);
    }
};
