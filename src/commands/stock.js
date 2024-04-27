const stock = require("../utils/getCurrentStock");
const stockImg = require("../utils/generateStockImg");

module.exports = {
    name: 'stock',
    description: 'Show the blox fruit dealer\'s current stock',
    callback: async (client, interaction) => {
        try {
            const stockArr = await stock();
            const imgBuffer = await stockImg(stockArr);
            
            interaction.reply({ files: [{ attachment: imgBuffer, name: 'stock.png' }] });
        } catch (error) {
            console.log(`[Command /stock]: ${error}`);
        }

    },
}