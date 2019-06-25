import { Client, Message } from 'discord.js';
import { env, handler } from "../index";

export const run = (bot: Client, msg: Message) => {
    const { PREFIX } = env;
    if(!msg.content.startsWith(PREFIX)) return;

    handler.handleCommand(msg);
};
