import { Client } from "discord.js";

export default (client: Client) => {
    if (!client.user) throw new Error("Client user is not defined");

    console.log(`✅ ${process.env["CLIENT_NAME"]} logged !!`);
    client.user.setActivity("[Fixed stock channel] sry for the bother");
};
