import { handler } from "../index";
import { Client } from "discord.js";

export const run = (_: Client) => {
  handler.loadCommands();
  // TODO: Replace with proper logger
  console.log("Bot is ready!");
};
