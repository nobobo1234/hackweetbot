import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import Handler from "./handler";
import { pingCommand } from "./commands";

// Simple Webserver that redirects to the repo to avoid application errors on the Heroku Plattform
import * as express from "express";
const app = express();
app.get("/", (req: express.Request, res: express.Response) => {
  res.redirect("https://github.com/nobobo1234/trainbot");
});
app.listen(process.env.PORT || 3000, () => console.log("Webserver started!"));

dotenv.config();

let handler: Handler;

function onReady(): void {
  //TODO: Replace with proper logger
  console.log("Discord bot ready!");
}

function onMessage(_: Discord.Client, msg: Discord.Message): void {
  if (!msg.content.startsWith(process.env.DISCORD_BOT_PREFIX)) return;

  handler.handleCommand(msg);
}

async function main(): Promise<void> {
  const client = new Discord.Client();
  handler = new Handler(client);
  handler.loadCommand("ping", pingCommand);

  client.on("ready", onReady);
  client.on("message", onMessage);
  client.login(process.env.TOKEN);
}

main();
