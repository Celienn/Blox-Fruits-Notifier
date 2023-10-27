const fs = require("fs");
const path = require("path");

module.exports = (directory) => {
    let fileNames = [];

    const files = fs.readdirSync(directory, { withFileTypes: true});

    for (const file of files) {
        const filePath = path.join(directory, file.name);
        
        fileNames.push(filePath);
    }
    
    return fileNames;
};