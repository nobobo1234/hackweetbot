import { Client, Message } from "discord.js";
import { todos, reminders } from "./index";

export async function pingCommand(bot: Client, msg: Message): Promise<void> {
  let m = await msg.channel.send("Ping!");
  if (m instanceof Message) m = [m];
  m[0].edit(`Pong! Time taken: ${Math.round(m[0].createdTimestamp - msg.createdTimestamp)} ms`);
  m.slice(1).forEach(mm => mm.delete(5000));
}

export async function todoCommand(bot: Client, msg: Message, args: Array<string>): Promise <void> {
  const currentTodos: string[] = todos.get(msg.author.id) || [];

  if(args.length === 0) {
    const todoString = [...currentTodos]
      .map((todo, index) => `${index+1}. ${todo}`);
    msg.channel.send(`\`\`\`\n${todoString.join('\n')}\`\`\`\nTry the subcommands \`add\`, \`remove\`, and \`edit\``);
  } else if(args[0] === 'add') {
    const todo = args.slice(1).join(' ');
    const newTodos = [...currentTodos].concat(todo);
    todos.set(msg.author.id, newTodos);
    msg.channel.send(`A new todo with the content \`${todo}\``);
  } else if(args[0] === 'remove') {
    const index = parseInt(args[1]) - 1;
    if(Number.isNaN(index)) throw "Please provide a valid number";
    if(index < currentTodos.length && index > 0) {
      const newTodos = [...currentTodos];
      const removedTodo = newTodos.splice(index, 1);
      todos.set(msg.author.id, newTodos);
      msg.channel.send(`Successfully removed todo with the content \`${removedTodo}\``)
    }
  } else if(args[0] === 'edit') {
    const index = parseInt(args[1]) - 1;
    if(Number.isNaN(index)) throw "Please provide a valid number";
    if(index < currentTodos.length && index >= 0) {
      const newTodos = [...currentTodos];
      newTodos[index] = args.slice(2).join(' ');
      todos.set(msg.author.id, newTodos);
      msg.channel.send(`Successfully edited todo ${index+1} with the new content \`${args.slice(2).join(' ')}\``);
    }
  }
}

export async function remindCommand(bot: Client, msg: Message, args: Array<string>): Promise <void> {

}
