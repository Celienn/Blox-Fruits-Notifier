import { Client } from "discord.js";
import emojis from "../../utils/emoji.js";

export default async (client: Client) => {
    await emojis.uploadAll(client);
};
