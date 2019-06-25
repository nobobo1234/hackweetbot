import { Client, Message } from "discord.js";

export const run = async (bot: Client, msg: Message) => {
  let m = await msg.channel.send("Ping!");
  if (m instanceof Message) {
    m = [m];
  }
  m[0].edit(`Pong! Time taken: ${Math.round(m[0].createdTimestamp - msg.createdTimestamp)}ms`);
  m.slice(1).forEach(mm => mm.delete(5000));
};
