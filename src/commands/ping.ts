export const run = async (bot, msg) => {
    const m = await msg.channel.send("Ping!");
    m.edit(`Pong! Time taken: ${Math.round(m.createdTimestamp - msg.createdTimestamp)}ms`);
}