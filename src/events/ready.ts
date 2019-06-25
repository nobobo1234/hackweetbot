import { handler } from '../index';
import { Client } from 'discord.js';

export const run = (bot: Client) => {
    handler.loadCommands();

    console.log("Bot is ready!");
}