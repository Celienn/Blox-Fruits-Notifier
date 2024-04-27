const stock = require("../../utils/getStockTime");
const getCurrStock = require("../../utils/getCurrentStock");
const GuildData = require("../../models/GuildData");
const UserData = require("../../models/UserData");
const refreshStockChannel = require("../../utils/refreshGuildStockChannel");
var currStock;

(async () => {
    currStock = await getCurrStock();
})();

async function refreshAllStockChannel(client) {
    try {
        const GuildsData = await GuildData.find({})
        if (!GuildsData) return;

        for (const gldData of GuildsData) {
            if (!gldData) continue
            refreshStockChannel(client, gldData.id, currStock);
        }

    } catch(error) {
        console.log(`[Function refreshAllStockChannel]: ${error}`)
    }
}

async function notifyPlayers(client) {
    try {
        const UsersData = await UserData.find({})
        if (!UsersData) return;

        usrDataLoop:
        for (const usrData of UsersData) {
            const user = client.users.cache.get(usrData.id);
            if (!user || !usrData.fruits || !usrData.notify) continue;
            for (fruit of currStock) {
                for (usrFruit of usrData.fruits){
                    if (usrFruit != fruit) continue;
                    try{
                        user.send(`${fruit} is currently in stock`)
                    }catch (err) {
                        // Bot probably blocked by the user
                        continue usrDataLoop;
                    }
                }
            }
        }

    } catch(error) {
        console.log(`[Function notifyPlayers]: ${error}`)
    }
}

function secondsToWait() {
    const now = Math.floor(Date.now() / 1000); 
    return stock.nextTimestamp() - now;
}

async function checkForNewStock(client,noretry=false) {
    let newStock;
    try{
        newStock = await getCurrStock();
    } catch (error) {
        console.error(`[Function checkForNewStock]: ${error}`)
        setTimeout(() => {checkForNewStock(client,noretry)},60000);
        return;
    }

    let isDiff = false;
    try{
        for (let i = 0 ; i < newStock.length ; i++){
            if (currStock[i] != newStock[i]) {
                isDiff = true;
                break;
            }
        }        
    } catch(error){
        console.error(`[Function checkForNewStock]: ${error}`);
    }

    if(newStock == []) isDiff = false;

    if (isDiff) {
        console.log(`New stock detected : ${newStock} .}`);
        // New stock detected 
        currStock = newStock;
        refreshAllStockChannel(client);
        setTimeout(() => {checkForNewStock(client)},secondsToWait()*1000);

        // Double check in 45 minutes
        setTimeout(() => {
            const sameStock = checkForNewStock(client,true);
            // Todo : Print to console how many player were notified and why not after how many double check
            // Send notification if double check pass
            if (sameStock) notifyPlayers(client);
        },60000*45);

        return false;
    }else {
        if (noretry) return true;
        // Retry in one minute 
        console.log("New stock not updated yet. Retrying in one minute.")
        setTimeout(() => {checkForNewStock(client)},60000);
        return true;
    }
}

module.exports = (client) => {
    refreshAllStockChannel(client);
    setTimeout(() => {checkForNewStock(client)},secondsToWait()*1000);
};
