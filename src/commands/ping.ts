import { Client, Message } from "discord.js";

export const run = async (bot: Client, msg: Message) => {
    const m = await msg.channel.send("Ping!");
    (m as Message).edit(`Pong! Time taken: ${Math.round((<Message>m).createdTimestamp - msg.createdTimestamp)}ms`);
};
