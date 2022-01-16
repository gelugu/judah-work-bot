import micro from "micro";
import { Telegraf } from "telegraf";
import { Work } from "./work/Wokr";

const bot = new Telegraf(process.env.TOKEN);

const users = {};

bot.start((ctx) =>
  ctx.reply("/work to start\n/rest to 10 minut timeout\n/stop to stop work")
);

bot.command("work", (ctx) => {
  const chatId = ctx.chat.id;

  const work = users[chatId] as Work;

  if (work) {
    let response = "U already working";
    response += `\nSince: ${work.getDateString()}`;
    response += "\nU can end session with /stop";

    ctx.reply(response);

    return;
  }

  users[chatId] = new Work();
  ctx.reply("Start working");
});

bot.command("rest", (ctx) => {
  const chatId = ctx.chat.id;

  if (!users[chatId]) {
    ctx.reply("U not working currently");

    return;
  }

  ctx.reply("In progress...\nBut ofcourse U can rest");
});

bot.command("stop", (ctx) => {
  const chatId = ctx.chat.id;

  if (!users[chatId]) {
    ctx.reply("U not working now");

    return;
  }

  const work = users[chatId] as Work;
  delete users[chatId];

  let response = "Stop working\n";
  response += `Work duration: ${work.getDateDiff()}`;

  ctx.reply(response);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// To prevent Heroku fail on port biding
const port = process.env.PORT
if (port) {
  const server = micro(() => {
    const botName = "@judahworkbot"
    return `Join telegram bot <a href=\"tg.me/${botName}\">${botName}</a>`;
  });
  server.listen(port, () => {
    console.log(`Server started on ${port} (Heroku)`);
  });
}
