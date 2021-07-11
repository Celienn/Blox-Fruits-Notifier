const express = require('express');
const fs = require('fs');
const app = express();
const port = 80;

app.get('/', async (req, res) => {
  var ip = req.connection.remoteAddress.split("::ffff:")[1];
  fs.promises.readFile(__dirname + "/iplogger.json").then(json => {
    var ips = JSON.parse(json);
    var save = 0
    for(var z = 1 ; z < ips["count"]+1 ; z++){
      if(ips[z.toString()] == ip){
        save = 1;
      }
    }
    if(save == 0){
      ips["count"] = ips["count"] + 1;
      ips[ips["count"]] = ip;
      fs.writeFileSync("iplogger.json",JSON.stringify(ips));
    }

    res.redirect("https://unity.com/fr")
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
});
