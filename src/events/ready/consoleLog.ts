import { Client } from "discord.js";

export default (client: Client) => {
    if (!client || !client.user) throw new Error("Client user is not defined");

    console.log(`✅ ${process.env["APP_NAME"] || "Fruit Notifier"} logged`);
    client.user.setActivity("[Fixed stock channel] sry for the bother");
};
