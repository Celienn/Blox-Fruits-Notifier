from urllib import request, response
import sys
import json

with request.urlopen('https://roblox-blox-piece.fandom.com/wiki/Blox_Fruits_%C2%A8Stock%C2%A8') as response :
    page = response.read()
    with open("data.json","r") as file :  
        data = json.load(file)  
        file.close()
        with open("data.json","+w") as output :
            data["guilds"][sys.argv[3]]["requests"][sys.argv[2]] = {}
            if str(page).split("$" + sys.argv[1] + "00")[0][len(str(page).split("$" + sys.argv[1])[0])-17] == "s" :
                data["guilds"][sys.argv[3]]["requests"][sys.argv[2]]["InSale"] = True
            else :
                data["guilds"][sys.argv[3]]["requests"][sys.argv[2]]["InSale"] = False
            output.write(json.dumps(data))

    print(str(page).split("$" + sys.argv[1] + "00")[0][len(str(page).split("$" + sys.argv[1])[0])-17])  
    print("$" + str(sys.argv[1]) + "00")