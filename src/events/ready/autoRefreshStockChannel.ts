import { Client } from 'discord.js';
import UserData from '../../models/UserData.js';
import GuildData from '../../models/GuildData.js';
import refreshStockChannel from '../../utils/refreshGuildStockChannel.js';
import stock from '../../utils/stockTime.js';
import getCurrStock from '../../utils/getCurrentStock.js';
var cachedStock: string[];

export function getCachedStock(): string[] {
    return cachedStock;
}

// todo move some of those functions to utils
async function refreshAllStockChannel(client: Client) {
    try {
        const GuildsData = await GuildData.find({})
        if (!GuildsData) return;

        for (const gldData of GuildsData) {
            if (!gldData) continue
            refreshStockChannel(client, gldData.id, cachedStock);
        }

    } catch(error) {
        console.error(`[Function refreshAllStockChannel]: ${error}`)
    }
}

async function notifyPlayers(client: Client) {
    try {
        const UsersData = await UserData.find({})
        if (!UsersData) throw new Error("No user data found");

        usrDataLoop: for (const usrData of UsersData) {
            const user = client.users.cache.get(usrData.id);
            if (!user || !usrData.fruits || !usrData.notify) continue;
            for (let fruit of cachedStock) {
                for (let usrFruit of usrData.fruits){
                    if (usrFruit != fruit) continue;
                    try{
                        user.send(`${fruit} is currently in stock`) // Todo improve the message
                    }catch (err) {
                        // Bot blocked by the user or no longer in a guild in which the bot is.
                        usrData.notify = false;
                        usrData.save().catch(err => {
                            console.error(`[Function notifyPlayers]: ${err}`);
                        });
                        console.log(`[Function notifyPlayers]: User ${user.id} has (probably) blocked the bot, notification disabled for this user.`);
                        continue usrDataLoop;
                    }
                }
            }
        }

    } catch(error) {
        console.error(`[Function notifyPlayers]: ${error}`)
    }
}

function arraysEqual(a: string[], b: string[]) {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export async function checkForNewStock(client: Client, noretry=false) {
    let newStock: string[];
    try{
        newStock = await getCurrStock();
    } catch (error) {
        console.error(`[Function checkForNewStock]: ${error}`)
        setTimeout(() => {checkForNewStock(client,noretry)},60000);
        return;
    }

    let isDiff = !arraysEqual(cachedStock, newStock);

    if(newStock.length === 0) isDiff = false;

    if (isDiff) {
        console.log(`New stock detected : ${newStock}`);
        // New stock detected 
        cachedStock = newStock;
        refreshAllStockChannel(client);
        setTimeout(() => {checkForNewStock(client)}, stock.milisecondsToWait());

        // Double check in 45 minutes
        setTimeout(() => {
            const sameStock = checkForNewStock(client,true); // ? Would be better to run checkForNewStock ?
            // Todo : Print to console how many player were notified and after how many checks
            // Send notification if double check pass
            if (sameStock != undefined) notifyPlayers(client);
        },60000*45);

        return false;
    }else {
        if (noretry) return true;
        // Retry in one minute 
        // console.log("New stock not updated yet. Retrying in one minute.")
        setTimeout(() => {checkForNewStock(client)},60000);
        return true;
    }
}

export default async (client: Client) => {
    while (!cachedStock || cachedStock.length === 0) {
        cachedStock = await getCurrStock();
    }
    refreshAllStockChannel(client);
    refreshStockChannel(client, "0", cachedStock); // Pass the cachedStock to the module
    setTimeout(() => {checkForNewStock(client)}, stock.milisecondsToWait());
};
