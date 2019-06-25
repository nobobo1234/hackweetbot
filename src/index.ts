import * as dotenv from "dotenv";
import * as Discord from "discord.js";
import { fromEvent, Observer, NextObserver, ErrorObserver } from "rxjs";
import { tap } from "rxjs/operators";
import { readFileSync } from "fs";
import { msgDateNLP } from "./nlp";

main();

function main() {
  const client = new Discord.Client();
  const env = dotenv.parse(readFileSync(".env"), { debug: true });
  client
    .login(env.DISCORD_BOT_TOKEN)
    .then(s => console.log("Discord bot logged in"))
    .catch(e => console.error("Login error", e));
  client.on("ready", () => console.log("Discord bot, ready!"));

  createMessageObservable(client)
    .pipe(msgDateNLP(client))
    .subscribe(botLogger());
}

function botMessageEcho() {
  return tap<Discord.Message>(m => {
    if (!(m.channel instanceof Discord.TextChannel)) return;
    if (m.channel.name !== "bottest") return;
    if (m.author === m.client.user) return;
    if (!m.mentions.users.has(m.client.user.id)) return;
    const user = m.author.username;
    console.log("Sending message");
    m.channel.sendMessage(`@${user}: ${m.content}`);
  });
}

function botLogger(): NextObserver<Discord.Message> & ErrorObserver<Discord.Message> {
  return {
    next(m: Discord.Message) {
      console.log(
        new Date(),
        m.channel instanceof Discord.TextChannel ? m.channel.name : m.channel.id,
        m.author.username,
        m.content
      );
    },
    error(e: any) {
      if (e instanceof Error) {
        console.error(new Date(), e.name, e.message);
      } else {
        console.error(new Date(), e);
      }
    }
  };
}

function createMessageObservable(client: Discord.Client) {
  return fromEvent<Discord.Message>(client, "message");
}
