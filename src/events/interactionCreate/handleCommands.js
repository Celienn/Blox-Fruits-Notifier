const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );
        
        if (!commandObject) return
        
        // TODO check if the bot have the required permissions to execute the command
        await commandObject.callback(client,interaction);
    } catch(error) {
        console.log(`[Commands Handler]: ${error}`);
    }
};