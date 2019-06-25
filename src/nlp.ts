import { PorterStemmer, BayesClassifier } from "natural";

type InputFunction<T> = (input: string) => T;

export function buildClassifier() {
  const classifier = new BayesClassifier();
  classifier.addDocument(["remind", "remind me", "tell me"], "reminder");
  classifier.addDocument(["todo", "list"], "todo");

  classifier.train();
  return classifier;
}

export function buildCommandsObjject() {
  const commands: Record<string, InputFunction<any>> = {};

  return {
    addCommand<T>(name: string, handler: InputFunction<T>) {
      commands[name] = handler;
      return this;
    },
    done() {
      return commands;
    }
  };
}

export function processInput<T>(
  classifier: BayesClassifier,
  commands: Record<string, InputFunction<T>>,
  input: string
): T {
  const key = classifier.classify(input);
  if (key in commands) {
    return commands[key](input);
  } else {
    throw new Error(`Command "${key}" does not exists`);
  }
}
