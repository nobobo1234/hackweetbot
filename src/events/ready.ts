import { handler } from '../index';

export const run = bot => {
    handler.loadCommands();

    console.log("Bot is ready!");
}