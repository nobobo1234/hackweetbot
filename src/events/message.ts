import { Client, Message } from "discord.js";
import { handler } from "../index";

export const run = (_: Client, msg: Message) => {
  if (!msg.content.startsWith(process.env.PREFIX)) return;

  handler.handleCommand(msg);
};
