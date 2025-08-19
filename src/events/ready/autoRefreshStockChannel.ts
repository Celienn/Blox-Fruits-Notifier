import { Client } from 'discord.js';
import UserData from '../../models/UserData.js';
import GuildData from '../../models/GuildData.js';
import refreshStockChannel from '../../utils/refreshGuildStockChannel.js';
import stock from '../../utils/stock.js';
import emojis from '../../utils/emojis.js'
import { type Fruit } from "../../utils/fruits.js";

// todo move some of those functions to utils
export async function refreshAllStockChannel(client: Client) {
    try {
        const GuildsData = await GuildData.find({})
        if (!GuildsData) return;

        stock.fetch();
        for (const gldData of GuildsData) {
            if (!gldData) continue;
            
            if (!stock.getUrl()) await refreshStockChannel(client, gldData.id);
            else void refreshStockChannel(client, gldData.id);
        }

    } catch(error) {
        console.error(`[Function refreshAllStockChannel]: ${error}`)
    }
}

export async function notifyUsers(client: Client) {
    try {
        const UsersData = await UserData.find({})
        if (!UsersData) throw new Error("No user data found");

        usrDataLoop: for (const usrData of UsersData) {
            const user = client.users.cache.get(usrData.id);
            if (!user || !usrData.fruits || !usrData.notify) continue;
            for (let fruit of stock.get()) {
                for (let usrFruit of usrData.fruits){
                    if (usrFruit != fruit.name.toLowerCase()) continue;
                    try{
                        const emoji = emojis.get(fruit.name.toLowerCase());
                        if (!emoji) throw new Error(`Emoji not found for fruit: ${fruit.name}`);
                        user.send(`<:${emoji.name}:${emoji.id}> ${fruit.name} is currently in stock`) // Todo improve the message
                    }catch (err) {
                        // Bot blocked by the user or no longer in a guild in which the bot is.
                        usrData.notify = false;
                        usrData.save().catch(err => {
                            console.error(`[Function notifyUsers]: ${err}`);
                        });
                        console.log(`[Function notifyUsers]: User ${user.id} has (probably) blocked the bot, notification disabled for this user.`);
                        continue usrDataLoop;
                    }
                }
            }
        }

    } catch(error) {
        console.error(`[Function notifyUsers]: ${error}`)
    }
}

function arraysEqual(a: any[], b: any[]) {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
    }
    return true;
}

const timeouts: NodeJS.Timeout[] = [];
export async function checkForNewStock(client: Client, noretry=false) {

    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts.length = 0;

    let oldStock = stock.get();
    let newStock: Fruit[];

    try{
        newStock = await stock.fetch();
    } catch (error) {
        console.error(`[Function checkForNewStock]: ${error}`)
        timeouts.push(setTimeout(() => {checkForNewStock(client,noretry)},60000));
        return;
    }

    let isDiff = !arraysEqual(oldStock, newStock);

    if(newStock.length === 0) isDiff = false;

    if (isDiff) {
        console.log('New stock detected:', newStock.map(fruit => fruit.name).join(', '));
        // New stock detected 
        refreshAllStockChannel(client);
        setTimeout(() => { checkForNewStock(client) }, stock.milisecondsToWait());

        // Double check in 45 minutes
        timeouts.push(setTimeout(async () => {
            const sameStock = await checkForNewStock(client,true); // ? Would be better to run checkForNewStock ?
            // Todo : Print to console how many user were notified and after how many checks
            // Send notification if double check pass
            if (sameStock) notifyUsers(client);
        },60000*45));

        return false;
    }else {
        if (noretry) return true;
        // Retry in one minute
        timeouts.push(setTimeout(() => {checkForNewStock(client)}, 60000));
        return true;
    }
}

export default async (client: Client) => {
    while (!stock.get() || stock.get().length === 0) {
        await stock.fetch();
    }
    refreshAllStockChannel(client);
    setTimeout(() => {checkForNewStock(client)}, stock.milisecondsToWait());
};
