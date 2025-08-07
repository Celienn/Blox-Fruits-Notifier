import { createCanvas, loadImage } from 'canvas';
import price from "./getDevilsFruitPrice.js";
import getESMPaths from "./getESMPaths.js";

const { __dirname } = getESMPaths(import.meta.url);

function priceToNumber(priceStr : string){
    return Number(priceStr.split(',').join(''));
}

function rarityByPrice(price: number) : string {
    if (price <= 180000 ) return 'Common'
    if (price <= 600000 ) return 'Uncommon'
    if (price <= 960000 ) return 'Rare'
    if (price <= 2400000 ) return 'Legendary'
    return 'Mythical'
}

const rarityColor: Record<string, string> = {
    "Common" : '#b3b3b3',
    "Uncommon" : '#5c8cd3',
    "Rare" : '#8c52ff',
    "Legendary" : '#d52be4',
    "Mythical" : '#ee2f32',
}

// TODO When more than 4 fruits create a new row of fruits

export default async (currStockArr: string[]) => {
    try {
        const width = 120 + (currStockArr.length-1)*95;
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


        for (const fruitIndex of currStockArr) {
            const fruitPriceStr: string | undefined = price[fruitIndex];
            const i = currStockArr.indexOf(fruitIndex);

            if (!fruitPriceStr) {
                console.error(currStockArr);
                console.log(`[Utils generateStockImg] Price for ${fruitIndex} not found.`);
                continue;
            }

            const fruitPrice = priceToNumber(fruitPriceStr);
            const image = await loadImage(__dirname + `/../../ressources/${fruitIndex}.png`);
            ctx.drawImage(image, 20 + i * 95, cornerRadius, 80, 80);

            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 1.25 * 5;
            
            ctx.fillStyle = rarityColor[ rarityByPrice(fruitPrice) ] || '#ffffff';
            let fruitName = fruitIndex.charAt(0).toUpperCase() + fruitIndex.slice(1,fruitIndex.length);
            ctx.fillText(fruitName, 20 + i * 95 + 40, 100);

            ctx.fillStyle = '#70ff39';
            ctx.fillText("$" + fruitPriceStr, 20 + i * 95 + 40, 120);
        }

        return canvas.toBuffer();
    } catch (error) {
        console.log(`[Utils generateStockImg]: ${error}`);
        throw error;
    }
};
