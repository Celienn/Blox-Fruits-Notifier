import { createCanvas, loadImage } from 'canvas';
import fruits, { type Fruit} from "./fruits.js";
import getESMPaths from "./getESMPaths.js";

const { __dirname } = getESMPaths(import.meta.url);

export function rarityByPrice(price: number) : string {
    if (price <= 180000 ) return 'Common'
    if (price <= 600000 ) return 'Uncommon'
    if (price <= 960000 ) return 'Rare'
    if (price <= 2400000 ) return 'Legendary'
    return 'Mythical'
}

export const rarityColor: Record<string, string> = {
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
            const fruit: Fruit | undefined = fruits[fruitIndex];
            const i = currStockArr.indexOf(fruitIndex);

            if (!fruit) {
                console.log(currStockArr);
                console.error(`[Utils generateStockImg] Price for ${fruitIndex} not found.`);
                continue;
            }

            const image = await loadImage(__dirname + `/../../ressources/${fruitIndex}.png`);
            ctx.drawImage(image, 20 + i * 95, cornerRadius, 80, 80);

            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 1.25 * 5;
            
            ctx.fillStyle = rarityColor[ rarityByPrice(fruit.price) ] || '#ffffff';
            let fruitName = fruit.name;
            ctx.fillText(fruitName, 20 + i * 95 + 40, 100);

            ctx.fillStyle = '#70ff39';
            ctx.fillText("$" + fruit.priceStr, 20 + i * 95 + 40, 120);
        }

        return canvas.toBuffer();
    } catch (error) {
        console.error(`[Utils generateStockImg]: ${error}`);
        throw error;
    }
};
