import { fileURLToPath } from "url";
import path from "path";

export default function getESMPaths(importMetaUrl: string) : { __filename: string; __dirname: string } {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = path.dirname(__filename);
    return { __filename, __dirname };
}