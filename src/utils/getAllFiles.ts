import fs from "fs";
import path from "path";

export default function getAllFiles(directory: string): string[] {
    let fileNames: string[] = [];

    const files: fs.Dirent[] = fs.readdirSync(directory, { withFileTypes: true});

    for (const file of files) {
        const filePath: string = path.join(directory, file.name);
        fileNames.push(filePath);
    }
    
    return fileNames;
};