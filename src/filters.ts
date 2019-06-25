import { filter } from "rxjs/operators";
import { DiscordAPIError, Message, TextChannel, User } from "discord.js";

export function msgInChannelFilter(name: string) {
  return filter<Message>(m => {
    if (!(m.channel instanceof TextChannel)) return false;
    return m.channel.name === name;
  });
}

export function msgUserMention(user: User | string | RegExp) {
  return filter<Message>(m => {
    if (typeof user === "string") {
      return m.mentions.users.filter(u => u.username === user).array().length > 0;
    } else if (user instanceof RegExp) {
      return m.mentions.users.filter(u => user.test(u.username)).array().length > 0;
    }
    return m.mentions.users.has(user.id);
  });
}
