import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TOKEN);

interface Work {
  startDate: Date;
}

const users = {};

bot.start((ctx) =>
  ctx.reply("/work to start\n/rest to 10 minut timeout\n/stop to stop work")
);

const getWork = (): Work => {
  return { startDate: new Date() };
};

const getDateString = (date: Date): string => {
  const current = new Date();

  let response = "";

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();

  if (
    current.getFullYear() > year ||
    current.getMonth() > month ||
    current.getDay() > day
  ) {
    response += `${day}.${month}.${year} `;
  }

  response += `${date.getHours()}:${date.getMinutes()}`;

  return response;
};

const getDateDiff = (date: Date): string => {
  const current = new Date();

  const diffTime = Math.abs(current.getTime() - date.getTime());
  console.log(current.getTime());
  console.log(date.getTime());
  console.log(diffTime);

  const diffHours = Math.floor(
    (current.getTime() - date.getTime()) / (1000 * 60 * 60)
  );
  const diffMinuts = Math.floor(
    (current.getTime() - date.getTime()) / (1000 * 60)
  );
  const diffSeconds = Math.floor((current.getTime() - date.getTime()) / 1000);

  let response = "";

  if (diffHours) response += `${diffHours} hours\n`
  else if (diffMinuts) response += `${diffMinuts} minuts\n`
  else if (diffSeconds) response += `${diffSeconds} seconds\n`

  response += diffHours > 3 ? "Well done!" : "Well...";

  return response;
};

bot.command("work", (ctx) => {
  const chatId = ctx.chat.id;

  if (users[chatId]) {
    let response = "U already working";
    response += `\nSince: ${getDateString(users[chatId].startDate)}`;
    response += "\nU can end session with /stop";

    ctx.reply(response);

    return;
  }

  users[chatId] = getWork();
  ctx.reply("Start working");
});

bot.command("rest", (ctx) => {
  const chatId = ctx.chat.id;

  if (!users[chatId]) {
    ctx.reply("U not working currently");

    return;
  }

  users[chatId] = getWork();
  ctx.reply("In progress...\nBut ofcourse U can rest");
});

bot.command("stop", (ctx) => {
  const chatId = ctx.chat.id;

  if (!users[chatId]) {
    ctx.reply("U not working now");

    return;
  }

  const startDate = users[chatId].startDate;
  delete users[chatId];

  let response = "Stop working\n";
  response += `Work duration: ${getDateDiff(startDate)}`;

  ctx.reply(response);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
