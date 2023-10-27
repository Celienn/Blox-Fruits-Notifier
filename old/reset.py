import json 

with open('data.json') as f:
  data = json.load(f)

data["stock"] = []

for z in data["guilds"] :
  data["guilds"][z]["requests"] = {}

fichier = open("data.json","w+")
fichier.write(json.dumps(data, indent = 4))    
fichier.close()
