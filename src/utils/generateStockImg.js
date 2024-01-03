const { createCanvas, loadImage } = require('canvas');
const price = require("../utils/getDevilsFruitPrice");

function priceToNumber(priceStr){
    if (typeof priceStr == 'number') return priceStr;
    return Number(priceStr.split(',').join(''));
}

function rarityByPrice(price){
    price = priceToNumber(price);

    if (price <= 180000 ) return 'Common'
    if (price <= 600000 ) return 'Uncommon'
    if (price <= 960000 ) return 'Rare'
    if (price <= 2400000 ) return 'Legendary'
    return 'Mythical'
}

const rarityColor = {
    "Common" : '#b3b3b3',
    "Uncommon" : '#5c8cd3',
    "Rare" : '#8c52ff',
    "Legendary" : '#d52be4',
    "Mythical" : '#ee2f32',
    
}

// TODO Generate and upload the stock image only one time per stock 
// TODO When more than 4 fruits create a new row of fruits

module.exports = async (currStockArr) => {
    try {
        const width = 120 + (currStockArr.length-1)*90;
        const height = 130;
        const cornerRadius = 8;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000000'; 
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 3; 
        ctx.beginPath();
        ctx.moveTo(cornerRadius, 0);
        ctx.arcTo(width, 0, width, height, cornerRadius);
        ctx.arcTo(width, height, 0, height, cornerRadius);
        ctx.arcTo(0, height, 0, 0, cornerRadius);
        ctx.arcTo(0, 0, width, 0, cornerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        for (let i = 0 ; i < currStockArr.length ; i++){
           
            const image = await loadImage(__dirname + `/../../ressources/images/${currStockArr[i]}.png`);
            ctx.drawImage(image, 20 + i * 90, cornerRadius, 80, 80);

            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 1.25 * 5;
            
            
            ctx.fillStyle = rarityColor[rarityByPrice(price[currStockArr[i]])];
            let fruitName = currStockArr[i].charAt(0).toUpperCase() + currStockArr[i].slice(1,currStockArr[i].lenght);
            ctx.fillText(fruitName, 20 + i * 90 + 40, 100);

            ctx.fillStyle = '#70ff39';
            ctx.fillText("$ " + price[currStockArr[i]], 20 + i * 90 + 40, 120);
        }

        return canvas.toBuffer();
    } catch (error) {
        console.log(error);
    }
};
