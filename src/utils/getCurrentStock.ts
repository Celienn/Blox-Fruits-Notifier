import axios from 'axios';
import fruits from './fruits.js';
const fruitNames = Object.keys(fruits);

const url: string = 'https://blox-fruits.fandom.com/wiki/Blox_Fruits_"Stock"';

export default async () => {
    try {
        const response = await axios.get(url);

        let page: string | undefined = response.data;
        let currentStock: string[] = [];

        if (page === undefined || page.length === 0) {
            throw new Error('Error retrieving stock data.');
        }

        page = page.toLowerCase().split('id="mw-customcollapsible-current"')?.pop()?.split('id="mw-customcollapsible-last"')[0];

        if (!page) {
            throw new Error('Error parsing stock data.');
        }

        for (const fruit of fruitNames) {
            const fruitIsInStock = page.includes(`>${fruit}<`);
            if (fruitIsInStock) currentStock.push(fruit);
        }

        if (currentStock.length === 1) currentStock.unshift("rocket","spin");

        return currentStock;
    } catch (error) {
        console.error('[Utils getCurrentStock]:', error);
        throw new Error('Failed to fetch current stock data.');
    }
};
