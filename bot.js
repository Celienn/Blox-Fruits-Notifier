const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const Canvas = require('canvas')
const { exec } = require('child_process');
const { request } = require('http');

const client = new Discord.Client();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// A Faire : 
// Data par user et plus data par user par serveur 
// quand find suprimé l'ancien pour éviter que le bot crash
// dans le find quand un fruit et en stock l'affché a droite du fruit dans le canvas 

fruits = [{"price":"30,000","name":"chop"},{"price":"60,000","name":"spring"},{"price":"80  ,000","name":"kilo"},{"price":"100,000","name":"smoke"},{"price":"180,000","name":"spin"},
          {"price":"250,000","name":"flame"},{"price":"300,000","name":"falcon"},{"price":"350,000","name":"ice"},{"price":"420,000","name":"sand"},{"price":"500,000","name":"dark"},
          {"price":"550,000","name":"diamond"},{"price":"650,000","name":"light"},{"price":"700,000","name":"love"},{"price":"750,000","name":"rubber"},{"price":"800,000","name":"barrier"},
          {"price":"850,000","name":"magma"},{"price":"950,000","name":"door"},{"price":"1,000,000","name":"quake"},{"price":"1,200,000","name":"buddha"},{"price":"1,500,000","name":"string"},
          {"price":"1,800,000","name":"phoenix"},{"price":"2,100,000","name":"rumble"},{"price":"2,300,000","name":"paw"},{"price":"2,500,000","name":"gravity"},
          {"price":"2,800,000","name":"dough"},{"price":"3,000,000","name":"venom"},{"price":"3,200,000","name":"control"},{"price":"3,500,000","name":"dragon"}  
        ]

exec("python \"c:/Users/Shadow/Desktop/Fruit Notifier/reset.py\"")  

var Interval = {count:0};
var Page = {}
Page["count"] = 0

function addPage(func,num){
    Page["count"] = Page["count"] + 1
    Page[Page["count"]] = {"function":func,"num":num}   
}

addPage(function(msg){
    msg.react("⬅️")
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"chop"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"spring"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"kilo"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"smoke"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"spin"))}})
        .then(() => {if(msg.deleted != true){msg.react("➡️")}})
},5)

addPage(function(msg){
    msg.react("⬅️")
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"flame"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"falcon"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"ice"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"sand"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"dark"))}})
        .then(() => {if(msg.deleted != true){msg.react("➡️")}})
},5)

addPage(function(msg){
    msg.react("⬅️")
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"diamond"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"light"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"love"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"rubber"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"barrier"))}})
        .then(() => {if(msg.deleted != true){msg.react("➡️")}})
},5)

addPage(function(msg){
    msg.react("⬅️")
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"magma"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"door"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"quake"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"buddha"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"string"))}})
        .then(() => {if(msg.deleted != true){msg.react("➡️")}})
},5)

addPage(function(msg){
    msg.react("⬅️")
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"phoenix"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"rumble"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"paw"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"gravity"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"dough"))}})
        .then(() => {if(msg.deleted != true){msg.react("➡️")}})
},5)


addPage(function(msg){
    msg.react("⬅️")
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"venom"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"control"))}})
        .then(() => {if(msg.deleted != true){msg.react(emoji(msg.guild,"Dragon"))}})
        .then(() => {if(msg.deleted != true){msg.react("➡️")}})
},3)

async function drawPage(index,message){
    const num = Page[index]["num"];
    const canvas = Canvas.createCanvas(1500, 1900);
    const context = canvas.getContext('2d');
    var img = await Canvas.loadImage(__dirname + '/Images/oldbg.jpg');
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    img = await Canvas.loadImage(__dirname + '/Images/logoo.png');
    context.drawImage(img, canvas.width/6, -100, canvas.width/1.5, img.height*2);
    context.font = '60px sans-serif';
    context.fillStyle = '#000000';
    for(let z = 0 ; z < num ; z++){
        img = await Canvas.loadImage(__dirname + '/Images/' + fruits[z + ((index-1)*5)]["name"] + '.jpg');
        context.drawImage(img, 100, 600 + (z * 250), 200, 200);
        context.font = '60px sans-serif';
        context.fillStyle = '#000000';
        context.fillText(maj(fruits[z + ((index-1)*5)]["name"]), 325, 675 + (z * 250));
        context.font = '60px sans-serif';
        context.fillStyle = '#009602';
        context.fillText(fruits[z + ((index-1)*5)]["price"] + "$", 350, 750+ (z * 250));
    }
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'find-' + index + '.png');
    const msg = await message.channel.send(attachment)
    Page[index]["function"](msg)
    //message.delete()
    return msg
}

function emoji(guild,name){
    const defaultGuild = client.guilds.cache.get(config.DEFAULT_SERVER);
    return defaultGuild.emojis.cache.find(emoji => emoji.name === name);
}

function maj(name){
    var output = name.split("")[0].toLocaleUpperCase()
    for(let z = 0 ; z < name.split("").length - 1 ; z++){
        output = output + name.split("")[z+1]
    }
    return output
}

function getRandomInt(min,max) {
    return Math.floor(min + Math.random() * max);
}

client.on("message", async function (message) {
    let Data = fs.readFileSync('data.json');
    Data = JSON.parse(Data);
    if(Data["guilds"][message.guild] != null){
        if(Data["guilds"][message.guild.id] == undefined){
            Data["guilds"][message.guild.id] = {"requests":{},"userdata":[]};
        }
    }
    if(message.author.id != client.user.id){
        if(message.content.startsWith(config.commandPrefix)){
            console.log("["+ message.createdAt.toString().split(" G")[0] + "] Claim | " + message.author.username + " (" + message.author.id + ") >> " + message.content);
            if(message.content.split(";")[1].split(" ")[0].toLocaleLowerCase()  == "check"){
                
                if(message.content.split(" ")[1] == undefined){
                    message.channel.send("Faut specifié le fruit neuneu");
                }else{
                    if(message.content.split(";")[1].split(" ")[1] == ""){
                        message.channel.send("Aucun fruit specifier .")
                    }else{
                        var fruit
                        fruits.forEach(element => {
                            if(element["name"] == message.content.split(" ")[1].toLocaleLowerCase()){
                                fruit = element;
                            }
                        });
                        if(fruit != undefined){
                            client.users.fetch(client.user.id).then(async (User) => {
                                const msg = await message.channel.send("placeholder")
                                Interval["count"] = Interval["count"] + 1;
                                const index = Interval["count"];
                                Interval[index] = setInterval(() => {
                                    exec('python \"c:/Users/Shadow/Desktop/Fruit Notifier/htmlget.py\" ' + fruit["price"] + " " + index.toString() + " " + msg.guild.id);
                                    let Data = fs.readFileSync('data.json');
                                    Data = JSON.parse(Data);
                                    Data = Data["guilds"][msg.guild.id]["requests"];
                                    response = Data[index.toString()]
                                    if(response != undefined){
                                        if(response["InSale"]){
                                            msg.edit("Le " + message.content.split(";")[1].split(" ")[1] + " est vente , VITE FONCE !!!")
                                        }else{
                                            msg.edit("Le " + message.content.split(";")[1].split(" ")[1] + " n'est pas en vente pour le moment ...")
                                        }
                                        clearInterval(Interval[index]);
                                    }
                                }, 500);
                            });
                        }else{
                            var fields = {}
                            for (let z = 0; z < fruits.length; z++) {
                                fields[z] = {name : fruits[z]["name"] , value: fruits[z]["price"], inline: true}
                            }
                            const exampleEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('Unidentified Fruit')
                                .setAuthor(config.BOT_NAME, client.user.displayAvatarURL())
                                .setDescription("Le fruit demander est introuvable .")
                                .addFields(fields)
                                .setTimestamp();
                            message.channel.send(exampleEmbed);
                        }
                    }
                }
            }
            if(message.content.split(";")[1].split(" ")[0].toLocaleLowerCase() == "notif"){ 
                var notif = ""
                let Data = fs.readFileSync('data.json');
                Data = JSON.parse(Data);
                if(message.guild != null){
                    Data["guilds"][message.guild.id]["userdata"][message.author.id].forEach(element => {
                        notif = notif + element + ",";
                    });
                }else{
                    Data["guilds"][message.channel.id]["userdata"][message.author.id].forEach(element => {
                        notif = notif + element + ",";
                    }); 
                }
                if(notif == ""){
                    message.channel.send(";find pour être notifer quand un fruits sera en vente")
                }else{
                    console.log(notif)
                    message.channel.send(message.author.toString() + " Tu sera notifer quand l'un de ses fruits sera en vente : " + notif)
                }
            }
            if(message.content.split(";")[1].split(" ")[0].toLocaleLowerCase() == "stock"){ 
                var notif = ""
                let Data = fs.readFileSync('data.json');
                Data = JSON.parse(Data);
                var stock = message.author.toString() + "\nStock :\n- Bomb\n- Spike\n"
                Data["stock"].forEach(element => {
                    stock = stock + "- " + maj(element) + "\n" 
                });
                message.channel.send(stock)
            }
            if(message.content.split(";")[1].split(" ")[0].toLocaleLowerCase() == "find"){ 
                const author = message.author
                if(message.content.split(";")[1].split(" ")[1] != undefined & !(parseInt(message.content.split(";")[1].split(" ")[1]) < 1) & !(parseInt(message.content.split(";")[1].split(" ")[1]) > Page["count"]) & parseInt(message.content.split(";")[1].split(" ")[1]).toString() != "NaN"){
                    Page[message.id] = parseInt(message.content.split(";")[1].split(" ")[1])
                }else{
                    Page[message.id] = 1
                }
                var msg = await drawPage(Page[message.id],message)
                client.on('messageReactionAdd', async (reaction, user) => {
                    if(user.id == author.id){
                        if(reaction.emoji.name == '➡️' || reaction.emoji.name == '⬅️'){
                            if(reaction.emoji.name == '➡️'){
                                Page[message.id] = Page[message.id] + 1
                            }else{
                                Page[message.id] = Page[message.id] - 1
                            }
                            if(Page[message.id] == Page["count"] + 1){
                                Page[message.id] = 1
                            }
                            if(Page[message.id] == 0){
                                Page[message.id] = Page["count"]
                            }
                            msg.delete()
                            msg = await drawPage(Page[message.id],message)
                        }else{
                            function maj(name){
                                var output = name.split("")[0].toLocaleUpperCase()
                                for(let z = 0 ; z < name.split("").length - 1 ; z++){
                                    output = output + name.split("")[z+1]
                                }
                                return output
                            }
                            fruits.forEach(element => {
                                if(element["name"] == reaction.emoji.name | maj(element["name"]) == reaction.emoji.name){
                                    let Data = fs.readFileSync('data.json');
                                    Data = JSON.parse(Data);
                                    if(reaction.message.guild == null){
                                        if(Data["guilds"][reaction.message.channel.id] == undefined){
                                            Data["guilds"][reaction.message.channel.id] = {}
                                            Data["guilds"][reaction.message.channel.id]["userdata"] = {}
                                            Data["guilds"][reaction.message.channel.id]["userdata"][user.id] = []
                                        }
                                        Data["guilds"][reaction.message.channel.id]["userdata"][user.id].push(reaction.emoji.name)
                                    }else{
                                        if(Data["guilds"][reaction.message.guild.id] == undefined){
                                            Data["guilds"][reaction.message.guild.id] = {"requests":{},"userdata":{}}
                                        }else{
                                            if(Data["guilds"][reaction.message.guild.id]["userdata"][user.id] == undefined){
                                                Data["guilds"][reaction.message.guild.id]["userdata"][user.id] = []
                                            }
                                            Data["guilds"][reaction.message.guild.id]["userdata"][user.id].push(reaction.emoji.name)
                                        }
                                    }
                                    fs.writeFileSync('data.json',JSON.stringify(Data), err => {
                                        if (err) {
                                            console.log('Error writing file', err);
                                        } else {
                                            console.log('Successfully wrote file');
                                        }
                                        });
                                }
                            });
                        }
                    }
                });
                client.on('messageReactionRemove', async (reaction, user) => {
                    if(user.id == author.id && !(reaction.emoji.name == '➡️' || reaction.emoji.name == '⬅️')){
                        function maj(name){
                            var output = name.split("")[0].toLocaleUpperCase()
                            for(let z = 0 ; z < name.split("").length - 1 ; z++){
                                output = output + name.split("")[z+1]
                            }
                            return output
                        }
                        fruits.forEach(element => {
                            if(element["name"] == reaction.emoji.name | maj(element["name"]) == reaction.emoji.name){
                                let Data = fs.readFileSync('data.json');
                                Data = JSON.parse(Data);
                                if(reaction.message.guild == null){
                                    if(Data["guilds"][reaction.message.channel.id]["userdata"][user.id] == undefined){
                                        Data["guilds"][reaction.message.channel.id]["userdata"][user.id] = []
                                    }
                                    Data["guilds"][reaction.message.channel.id]["userdata"][user.id].push(reaction.emoji.name)
                                    var newUserData = []
                                    Data["guilds"][reaction.message.channel.id]["userdata"][user.id].forEach(elementt => {
                                        if(element["name"] != elementt){
                                            newUserData.push(elementt)
                                        }
                                    });
                                    Data["guilds"][reaction.message.channel.id]["userdata"][user.id] = newUserData;
                                }else{
                                    if(Data["guilds"][reaction.message.guild.id]["userdata"][user.id] == undefined){
                                        Data["guilds"][reaction.message.guild.id]["userdata"][user.id] = []
                                    }
                                    Data["guilds"][reaction.message.guild.id]["userdata"][user.id].push(reaction.emoji.name)
                                    var newUserData = []
                                    Data["guilds"][reaction.message.guild.id]["userdata"][user.id].forEach(elementt => {
                                        if(element["name"] != elementt){
                                            newUserData.push(elementt)
                                        }
                                    });
                                    Data["guilds"][reaction.message.guild.id]["userdata"][user.id] = newUserData;
                                }
                                fs.writeFileSync('data.json',JSON.stringify(Data), err => {
                                    if (err) {
                                        console.log('Error writing file', err);
                                    } else {
                                        console.log('Successfully wrote file');
                                    }
                                });
                            }
                        });
                    }
                });
            } 
        }else{

        }
    }else{
        console.log("["+ message.createdAt.toString().split(" G")[0] + "] Response | " + config.BOT_NAME + " (" + client.user.id + ") >> " + message.content);
    }
});

function refreshStock(){
    var responseCount = 0
    exec("python \"c:/Users/Shadow/Desktop/Fruit Notifier/reset.py\"")  
    fruits.forEach(element => {
        setTimeout(function(){
            Interval["count"] = Interval["count"] + 1;
            const index = Interval["count"];
            Interval[index] = setInterval(() => {
                exec('python \"c:/Users/Shadow/Desktop/Fruit Notifier/htmlget.py\" ' + element["price"] + " " + index.toString() + " 0");
                let Data = fs.readFileSync('data.json');
                Data = JSON.parse(Data);
                Data = Data["guilds"]["0"]["requests"];
                response = Data[index.toString()]
                if(response != undefined){
                    responseCount = responseCount + 1
                    if(response["InSale"]){
                        console.log(element["name"] + " est en vente .")
                        let Data = fs.readFileSync('data.json');
                        Data = JSON.parse(Data);
                        Data["stock"].push(element["name"])
                        fs.writeFileSync('data.json',JSON.stringify(Data), err => {
                            if (err) {
                                console.log('Error writing file', err);
                            } else {
                                console.log('Successfully wrote file');
                            }
                        });
                    }else{
                        
                    }
                    clearInterval(Interval[index]);
                }
            }, getRandomInt(30000,60000)); 
        }, getRandomInt(30000,60000));
    });
    Interval["count"] = Interval["count"] + 1;
    const index = Interval["count"];
    Interval[index] = setInterval(() => {
        if(responseCount == fruits.length){
            console.log("done")
            let Data = fs.readFileSync('data.json');
            Data = JSON.parse(Data);
            Data["stock"].forEach(stock => {
                for(z in Data["guilds"]){
                    for(x in Data["guilds"][z]["userdata"]){
                        Data["guilds"][z]["userdata"][x].forEach(element => {
                            if(element == stock){
                                console.log(x + " va être notifer : " + element + " en stock")
                                if(x == 337295754609819650){
                                    client.users.fetch(x, false).then((user) => {
                                        user.send(user.toString() + " le " + element + " est en stock .");
                                    });
                                }else{
                                    if(x == 386478223099428876){
                                        client.users.fetch(x, false).then((user) => {
                                            user.send(user.toString() + " le " + element + " est en stock . (PS:Paypal.me/Decta)");
                                        });
                                    }else{
                                        client.users.fetch(x, false).then((user) => {
                                            user.send(user.toString() + " le " + element + " est en stock .");
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });
            clearInterval(Interval[index]);
        }
    });
}

client.on('messageUpdate', (oldMessage, newMessage) => {
    console.log("["+ newMessage.createdAt.toString().split(" G")[0] + "] Edit (" + oldMessage.id + ")| by " + newMessage.author.username + " (" + newMessage.author.id + ") >> " + oldMessage.content + " ==> " + newMessage.content);
});

client.once('ready', () => {
    console.log(config.BOT_NAME + ` logged !`);
    client.user.setActivity(";find <page>")
    exec("python \"c:/Users/Shadow/Desktop/Fruit Notifier/reset.py\"")
    refreshStock()
    Interval["count"] = Interval["count"] + 1;
    const index = Interval["count"];
    Interval[index] = setInterval(() => {
        refreshStock()
    }, 5800000);
});

client.on('error', console.error);

client.login(config.BOT_TOKEN);
