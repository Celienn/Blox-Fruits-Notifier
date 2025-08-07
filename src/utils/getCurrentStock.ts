import axios from 'axios';
import fruits from './getDevilsFruitPrice.js';
const fruitNames = Object.keys(fruits);

const url: string = 'https://blox-fruits.fandom.com/wiki/Blox_Fruits_"Stock"';

export default new Promise<string[]>((resolve, reject) => {
    axios.get(url)
        .then(response => {
            let page: string | undefined = response.data;
            let currentStock: string[] = [];

            if (page === undefined || page.length === 0) {
                return reject('Error retrieving stock data.');
            }

            page = page.toLowerCase().split('id="mw-customcollapsible-current"')?.pop()?.split('id="mw-customcollapsible-last"')[0];

            if (!page) {
                return reject('Error parsing stock data.');
            }

            for (const fruit of fruitNames) {
                const fruitIsInStock = page.includes(`>${fruit}<`);
                if (fruitIsInStock) currentStock.push(fruit);
            }

            if (currentStock.length === 1) currentStock.unshift("rocket","spin");

            resolve(currentStock);
        })
        .catch(error => {
            console.error('[Utils getCurrentStock]:', error);
            reject(error);
        });
});
