import { Client, Message } from "discord.js";

export const run = async (bot: Client, msg: Message) => {
    const m = await msg.channel.send("Ping!");
    (<Message>m)
        .edit(`Pong! Time taken: ${Math.round((<Message>m).createdTimestamp - msg.createdTimestamp)}ms`);
}