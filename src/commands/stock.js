const Canvas = require('canvas')
const fruits = require("../utils/getDevilsFruitPrice");
const stock = require("../utils/getCurrentStock");

module.exports = {
    name: 'stock',
    description: 'Show the blox fruit dealer\'s current stock',
    callback: async (client, interaction) => {
        // num ==> number of devil fruits in sells 
        try {
            /*
            const num = 3;

            const canvas = Canvas.createCanvas(1500, 1900);
            const context = canvas.getContext('2d');
    
            var img = await Canvas.loadImage(__dirname + '/../../ressources/images/oldbg.jpg');
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
    
            img = await Canvas.loadImage(__dirname + '/../../ressources/images/logoo.png');
            context.drawImage(img, canvas.width/6, -100, canvas.width/1.5, img.height*2);
            context.font = '60px sans-serif';
            context.fillStyle = '#000000';
            for(let z = 0 ; z < num ; z++){
                img = await Canvas.loadImage(__dirname + '/../../ressources/images/' + fruits[z + ((index-1)*5)]["name"] + '.png');
                context.drawImage(img, 100, 600 + (z * 250), 200, 200);
                context.font = '60px sans-serif';
                context.fillStyle = '#000000';
                context.fillText(maj(fruits[z + ((index-1)*5)]["name"]), 325, 675 + (z * 250));
                context.font = '60px sans-serif';
                context.fillStyle = '#009602';
                context.fillText(fruits[z + ((index-1)*5)]["price"] + "$", 350, 750+ (z * 250));
            }
            const attachment = new MessageAttachment(canvas.toBuffer(), 'find-' + index + '.png');
            
            interaction.reply({ files: attachment });
            */
            const currStockArr = await stock();
            const currStockStr = currStockArr.join(', ')
            interaction.reply(currStockStr);
        } catch (error) {
            console.log(error);
        }

    },
}