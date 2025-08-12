import { Client } from "discord.js";
import emojis from "../../utils/emojis.js";
import { initChoices } from "../../commands/add-v2.js";
import { initChoices as add } from "../../commands/add.js";

export default async (client: Client) => {
    await emojis.init();
    await emojis.uploadAll(client);
    initChoices();
    add();
    console.log("✅ Emojis updated successfully.");
};
