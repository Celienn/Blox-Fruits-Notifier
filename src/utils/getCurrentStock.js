const axios = require('axios');
const fruits = require("./getDevilsFruitPrice");
const fruitNames = Object.keys(fruits);

const url = 'https://blox-fruits.fandom.com/wiki/Blox_Fruits_"Stock"';

module.exports = () => {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                var page = response.data;
                var currentStock = [];
                page = page.toLowerCase().split('id="mw-customcollapsible-current"').pop().split('id="mw-customcollapsible-last"')[0];
                for (const fruit of fruitNames) {
                    const fruitIsInStock = page.includes(`>${fruit}<`);
                    if (fruitIsInStock) currentStock.push(fruit);
                }

                resolve(currentStock);
            })
            .catch(error => {
                console.error('[Utils getCurrentStock]:', error);
                reject(error);
            });
    });
}
