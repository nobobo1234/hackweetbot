import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { createServer, IncomingMessage, ServerResponse } from "http";
import Handler from "./handler";
import { pingCommand, todoCommand } from "./commands";

// Simple Webserver that redirects to the repo to avoid application errors on the Heroku Plattform
createServer(redirectHandler).listen(process.env.PORT || 5000);
dotenv.config();

let handler: Handler;
export const todos: Discord.Collection<string, string[]> = new Discord.Collection();

function redirectHandler(_: IncomingMessage, res: ServerResponse): void {
  res.writeHead(302, { Location: process.env.GITHUB_PROJECT });
  res.end();
}

function onReady(): void {
  //TODO: Replace with proper logger
  console.log("Discord bot ready!");
}

function onMessage(msg: Discord.Message): void {
  if (!msg.content.startsWith(process.env.DISCORD_BOT_PREFIX)) return;

  handler.handleCommand(msg);
}

async function main(): Promise<void> {
  const client = new Discord.Client();
  handler = new Handler(client);
  handler.loadCommand("ping", pingCommand);
  handler.loadCommand("todo", todoCommand);

  client.on("ready", onReady);
  client.on("message", onMessage);
  client.login(process.env.DISCORD_BOT_TOKEN);
}

main();
