const path = require('path');
const getAllFiles = require("./getAllFiles");

module.exports = () => {
    let localCommands = [];
    
    const commandDir = path.join(__dirname,"..","commands");
    const commandFiles = getAllFiles(commandDir);

    for (const commandFile of commandFiles) {
        const commandFunc = require(commandFile);
        
        localCommands.push(commandFunc);
    }

    return localCommands;
};