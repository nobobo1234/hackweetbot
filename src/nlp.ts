import { PorterStemmer, BayesClassifier } from "natural";
import { Message, MessageOptions } from "discord.js";
import { writeFile, readFile } from "fs";
import { promisify } from "util";
import { join } from "path";

type InputFunction = (input: string, msg: Message) => string;
type MessageResult = string | [string, MessageOptions];

export function createProcessor(
  classifier: BayesClassifier,
  commands: Record<"reminder" | "todo", InputFunction>
): (message: Message) => MessageResult {
  return processInput.bind(null, classifier, commands);
}

export function saveClassifier(path: string, classifier: BayesClassifier): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(path, JSON.stringify(classifier), err => {
      if (err) reject(err);
      resolve();
    });
  });
}
export function loadClassifier(path: string): Promise<BayesClassifier> {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(BayesClassifier.restore(JSON.parse(data.toString())));
    });
  });
}

export async function createClassifier() {
  const classifier = new BayesClassifier();
  const trainFilepath = join(process.cwd(), "data", "trainData.json");
  const trainData: CommandTrainingData = JSON.parse(await promisify(readFile)(trainFilepath).then(d => d.toString()));
  for (const key of Object.keys(trainData)) {
    classifier.addDocument(trainData[key], key);
  }
  classifier.train();
  return classifier;
}

export function buildCommandsObject() {
  const commands: Record<string, InputFunction> = {};

  return {
    addCommand<T>(name: string, handler: InputFunction) {
      commands[name] = handler;
      return this;
    },
    done() {
      return commands;
    }
  };
}

function processInput(classifier: BayesClassifier, commands: CommandHandlers, message: Message): MessageResult {
  const input = message.cleanContent;
  const outputs = classifier.getClassifications(input).sort((a, b) => b.value - a.value);
  const first = outputs[0];
  const second = outputs[1];
  if (first.value - second.value < 0.1) return [`Sorry, could not recognize a command\n${JSON.stringify(outputs)}`, {}];
  const key = outputs[0].label;
  if (!(key in commands)) {
    throw new Error(`Command "${key}" does not exists`);
  }
  const result = commands[key](input, message);
  return [result + `\n${JSON.stringify(outputs)}`, { reply: message.author }];
}

type CommandTrainingData<C extends string = string> = Record<C, string[]>;
type CommandHandlers<C extends string = string> = Record<C, InputFunction>;
