import { config } from "dotenv";
import { Client, TextChannel, Message } from "discord.js";
import { createProcessor, loadClassifier, saveClassifier, createClassifier } from "./nlp";
import { stat, exists, mkdir } from "fs";
import { join, dirname } from "path";
import { BayesClassifier } from "natural";
import { promisify } from "util";

const existsP = promisify(exists);
const mkdirP = promisify(mkdir);
const statP = promisify(stat);

config();
main().catch(err => {
  if (err instanceof Error) console.error(err.name, err.message, err.stack);
  else console.error(err);
  process.exit(1);
});

async function main() {
  const client = new Client();
  const classifier = await createOrLoadClassifier();
  const processor = createProcessor(classifier, {
    reminder: input => `Reminder command called: ${input}`,
    todo: input => `Todo command called: ${input}`
  });
  client.on("ready", () => console.log("Discord bot is ready!"));
  client.on("message", m => processMessage(client, processor, m));

  client.login(process.env.DISCORD_BOT_TOKEN);
}

function processMessage(client: Client, processor: ReturnType<typeof createProcessor>, message: Message): void {
  console.log(
    new Date(),
    message.channel instanceof TextChannel ? message.channel.name : message.channel.id,
    message.content
  );
  // Don't process bot messages, or messages not target at the bot
  if (message.author.bot) return;
  if (!message.mentions.users.has(client.user.id)) return;
  try {
    const res = processor(message);
    if (typeof res === "string") {
      message.channel.send(res, { reply: message.author });
    } else {
      const [msg, opts] = res;
      message.channel.send(msg, opts);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(new Date(), err.name, err.message);
      message.channel.send(`:x: Error! [${err.name}] ${err.message}`);
    } else {
      console.error(new Date(), err);
      message.channel.send(`:x: Error! ${err}`);
    }
  }
}

async function createOrLoadClassifier(): Promise<BayesClassifier> {
  const trainFilePath = join(process.cwd(), "data", "classifier.json");
  if (await existsP(trainFilePath)) {
    return loadClassifier(trainFilePath);
  } else {
    const c = await createClassifier();
    const trainFileDir = dirname(trainFilePath);
    const e = await existsP(trainFileDir);
    if (!e) await mkdirP(trainFileDir, { recursive: true });

    if (!(await statP(trainFileDir)).isDirectory())
      throw new Error("Can't write file into non-folder at " + dirname(trainFilePath));
    await saveClassifier(trainFilePath, c);
    return c;
  }
}
