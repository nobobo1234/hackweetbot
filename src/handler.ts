import { Client, Message, Collection } from "discord.js";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandFunction = (bot: Client, msg: Message, args: any[]) => void;

export default class Handler {
  public bot: Client;
  public cmds: Collection<string, CommandFunction>;

  public constructor(bot: Client) {
    this.bot = bot;
    this.cmds = new Collection();
  }

  public loadCommand(base: string, cmd: CommandFunction): void {
    this.cmds.set(base, cmd);
  }

  public async handleCommand(msg: Message): Promise<void> {
    const args = msg.content
      .slice(process.env.DISCORD_BOT_PREFIX.length)
      .trim()
      .split(" ");
    const base = args.shift().toLowerCase();

    if (!base) {
      msg.channel.send(":x: You need to provide a command");
      return;
    }

    const command = this.cmds.get(base);
    if (command) {
      try {
        await command(this.bot, msg, args);
      } catch (e) {
        const m = await msg.channel.send(`:x: ${e}`);
        (m as Message).delete(5000);
      }
    } else {
      msg.channel.send(`:x: Sorry, the command ${base} isn't found.`);
    }
  }
}
