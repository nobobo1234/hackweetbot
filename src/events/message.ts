import { env, handler } from "../index";

export const run = (bot, msg) => {
    const { PREFIX } = env;
    if(!msg.content.startsWith(PREFIX)) return;

    handler.handleCommand(msg);
};
