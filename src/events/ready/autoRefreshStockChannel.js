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
            refreshStockChannel(client, gldData.id);
        }

    } catch(error) {
        console.log(`Error: ${error}`)
    }
}

async function notifyPlayers(client) {
    try {
        const UsersData = await UserData.find({})
        if (!UsersData) return;

        for (const usrData of UsersData) {
            const user = client.users.cache.get(usrData.id);
            if (!user || !usrData.fruits) continue
            for (fruit of currStock) {
                for (usrFruit of usrData.fruits){
                    if(usrFruit == fruit) user.send(`${fruit} is currently in stock`);
                }
            }
        }

    } catch(error) {
        console.log(`Error: ${error}`)
    }
}

function secondsToWait() {
    const now = Math.floor(Date.now() / 1000); 
    return stock.nextTimestamp() - now;
}

async function checkForNewStock(client) {
    const newStock = await getCurrStock();
    
    let isDiff = false;
    try{
        for (let i = 0 ; i < newStock.length ; i++){
            if (currStock[i] != newStock[i]) {
                isDiff = true;
                break;
            }
        }        
    } catch(error){
        console.error(error);
    }

    if (isDiff) {
        console.log(`new stock detected : ${currStock} & ${newStock} ; cond ${(currStock != newStock)}`);
        // New stock detected 
        currStock = newStock;
        refreshAllStockChannel(client);
        notifyPlayers(client);
        setTimeout(() => {checkForNewStock(client)},secondsToWait()*1000);
    }else {
        // Retry in one minute 
        console.log("retrying")
        setTimeout(() => {checkForNewStock(client)},60000);
    }
}

module.exports = (client) => {
    refreshAllStockChannel(client);
    setTimeout(() => {checkForNewStock(client)},secondsToWait()*1000);
};
