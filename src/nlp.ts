import { tap } from "rxjs/operators";
import { Message, Client } from "discord.js";
import * as chrono from "chrono-node";
import { of } from "rxjs";
import { msgInChannelFilter, msgUserMentionFilter } from "./filters";

export function msgDateNLP(client: Client) {
  return tap<Message>(m => {
    of(m)
      .pipe(
        msgInChannelFilter("bottest"),
        msgUserMentionFilter(client.user),
        processMessage()
      )
      .subscribe();
  });
}

function processMessage() {
  return tap<Message>(m => {
    const data = chrono.parse(m.content);
    if (data.length == 0) return;
    console.log("Parsed data", data);
    let message = "Reminder: ";
    data.forEach(d => {
      message += "\n\t- Start date: " + d.start.date().toString();
      if (d.end) {
        message += ", end date: " + d.end.date().toString();
      }
    });
    m.channel.sendMessage(message, { reply: m.author });
  });
}
