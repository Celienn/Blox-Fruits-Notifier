const fruits = require("../utils/getDevilsFruitPrice");

const fruitsNames = Object.keys(fruits);
let emojiArray = {};

module.exports = async (client,emojiName) => {

    if (Object.keys(emojiArray).length == 0){
        const guild = await client.guilds.fetch(process.env.DEFAULT_GUILD);

        for (const fruit of fruitsNames) {
            const emoji = await guild.emojis.cache.find(e => e.name === fruit);
            emojiArray[fruit] = emoji; 
        }
    }
    return emojiArray[emojiName];
}
