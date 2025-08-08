import type { Client } from "discord.js";
import path from "path";
import getAllFiles from "../utils/getAllFiles.js";
import getESMPaths from "../utils/getESMPaths.js";

const { __dirname } = getESMPaths(import.meta.url);

export default function eventHandler(client: Client): void {
    const eventFolders: string[] = getAllFiles(path.join(__dirname, "..", "events"));

    for (const eventFolder of eventFolders) {
        const eventFiles: string[] = getAllFiles(eventFolder);

        const eventName: string | undefined = eventFolder.split("/").pop();
        if (!eventName) {
            console.error(`❌ Event name could not be determined for folder: ${eventFolder}`);
            continue;
        }

        client.on(eventName, async (arg: any) => {
            for (const eventFile of eventFiles) {
                const eventModule = await import(eventFile);
                const eventFunction: (client?: Client, arg?: unknown) => Promise<void> = eventModule.default || eventModule;
                try {
                    await eventFunction(client, arg);
                } catch (error) {
                    console.error(`❌ Error in event handler for ${eventName} in file ${eventFile}:`, error);
                }
            }
        });
    }
};