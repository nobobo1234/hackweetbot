import { Client, Message, Collection } from "discord.js";
import * as path from "path";
import { readdirSync } from "fs";
import { Command } from "./types";

export default class Handler {
  bot: Client;
  cmds: Collection<string, Command>;

  constructor(bot: Client) {
    this.bot = bot;
    this.cmds = new Collection();
  }

  loadCommands() {
    const commands = readdirSync(path.join(__dirname, "commands"));
    for (const command of commands) {
      const base = command.split(".")[0];
      const cmd = require(path.join(__dirname, "commands", command));
      this.loadCommand(base, cmd);
    }
  }

  loadCommand(base: string, cmd: Command) {
    this.cmds.set(base, cmd);
  }

  async handleCommand(msg: Message) {
    const args = msg.content
      .slice(process.env.PREFIX.length)
      .trim()
      .split(" ");
    const base = args.shift().toLowerCase();

    if (!base) return msg.channel.send(":x: You need to provide a command");

    const command = this.cmds.get(base);
    if (command) {
      try {
        await command.run(this.bot, msg, args);
      } catch (e) {
        const m = await msg.channel.send(`:x: ${e}`);
        (m as Message).delete(5000);
      }
    } else {
      msg.channel.send(`:x: Sorry, the command ${base} isn't found.`);
    }
  }
}
