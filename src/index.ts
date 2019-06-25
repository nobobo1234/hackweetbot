import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { readdirSync, readFileSync } from "fs";
import * as path from "path";
import Handler from "./handler";

dotenv.config();
export let handler;

async function main() {
  const client = new Discord.Client();
  handler = new Handler(client);

  const events = readdirSync(path.join(__dirname, "events"));
  for (const event of events) {
    const name = event.split(".")[0];
    const eventFunc = await import(path.join(__dirname, "events", name));
    client.on(name, (...args) => eventFunc.run(client, ...args));
  }

  client.login(process.env.TOKEN);
}

main();
