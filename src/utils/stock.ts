import axios from 'axios';
import fruits, { type Fruit, Rarity } from './fruits.js';
import { createCanvas, loadImage } from 'canvas';
import getESMPaths from "./getESMPaths.js";

const { __dirname } = getESMPaths(import.meta.url);
const fruitList = fruits.list();
const refreshHours: number[] = [0, 4, 8, 12, 16, 20]; // UTC+0 time zone
const stockURL: string = 'https://blox-fruits.fandom.com/wiki/Blox_Fruits_"Stock"';
const rarityColor: Record<Rarity, string> = {
    [Rarity.Common] : '#b3b3b3',
    [Rarity.Uncommon] : '#5c8cd3',
    [Rarity.Rare] : '#8c52ff',
    [Rarity.Legendary] : '#d52be4',
    [Rarity.Mythical] : '#ee2f32',
}

let cachedStock: Fruit[] = [];
let url: string | undefined;

const stock = {
    get: (): Fruit[] => {
        return [...cachedStock];
    },
    nextHour: (): number => {
        const now = new Date();
        const currentHour = now.getHours();

        for (const hour of refreshHours) {
            if (currentHour < hour) return hour;
            if (hour == refreshHours[5]) return refreshHours[0] || 0;
        }

        throw new Error("No next hour found in refresh hours");
    },
    nextTimestamp: (): number => {

        const now = new Date();
        const currentHour = now.getUTCHours();

        for (const hour of refreshHours) {
            if (currentHour < hour) {
                now.setUTCHours(hour,0,0,0);
                break;
            }
            if (hour != refreshHours[5]) continue;
            now.setUTCDate(now.getUTCDate() + 1);
            now.setUTCHours(refreshHours[0] || 0,0,0,0);
        }
        
        return now.getTime();
    },
    milisecondsToWait: () => {
        const now = Date.now();
        return stock.nextTimestamp() - now;
    },
    fetch: async (): Promise<Fruit[]> => {
        try {
            const response = await axios.get(stockURL);

            let page: string | undefined = response.data;
            let currentStock: string[] = [];

            if (page === undefined || page.length === 0) {
                throw new Error('Error retrieving stock data.');
            }

            page = page.toLowerCase().split('id="mw-customcollapsible-current"')?.pop()?.split('id="mw-customcollapsible-last"')[0];

            if (!page) {
                throw new Error('Error parsing stock data.');
            }

            for (const fruit of fruitList) {
                const fruitIsInStock = page.includes(`>${fruit.name.toLowerCase()}<`);
                if (fruitIsInStock) currentStock.push(fruit.name.toLowerCase());
            }

            if (currentStock.length === 1) currentStock.unshift("rocket","spin");

            cachedStock = fruitList.filter(fruit => currentStock.includes(fruit.name.toLowerCase()));
        } catch (error) {
            console.error('[Utils stock.fetch]:', error);
            throw new Error('Failed to fetch current stock data.');
        }

        return cachedStock;
    },
    genImg: async () => {
        try {
            const width = 120 + (cachedStock.length-1)*95;
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


            for (const fruit of cachedStock) {
                const i = cachedStock.indexOf(fruit);

                if (!fruit.price) {
                    console.log(cachedStock);
                    console.error(`[Utils generateStockImg] Price for ${fruit.name} not found.`);
                    continue;
                }

                const image = await loadImage(__dirname + `/../../ressources/${fruit.name.toLowerCase()}.png`);
                ctx.drawImage(image, 20 + i * 95, cornerRadius, 80, 80);

                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 1.25 * 5;
                
                ctx.fillStyle = rarityColor[fruit.rarity] || '#ffffff';
                let fruitName = fruit.name;
                ctx.fillText(fruitName, 20 + i * 95 + 40, 100);

                ctx.fillStyle = '#70ff39';
                ctx.fillText("$" + fruit.price.toLocaleString(), 20 + i * 95 + 40, 120);
            }

            return canvas.toBuffer();
        } catch (error) {
            console.error(`[Utils stock.genImg]: ${error}`);
            throw error;
        }
    },
    setUrl : (newUrl: string | undefined) => {
        url = newUrl;
        return true;
    },
    getUrl : () => {
        return url;
    }
};

export default stock;