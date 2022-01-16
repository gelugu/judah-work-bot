import { buffer } from "stream/consumers";
import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import { Work } from "../work/Wokr";

export class Bot {
  private bot: Telegraf<Context<Update>>;
  private users: object;
  private buttons: object;

  constructor(token: string = process.env.TOKEN) {
    this.bot = new Telegraf(token);
    this.users = {};
    this.buttons = {
      work: Markup.button.text("/work"),
      rest: Markup.button.text("/rest"),
      stop: Markup.button.text("/stop"),
    };
  }

  private start() {
    const message =
      "/work to start\n/rest to 10 minut timeout\n/stop to stop work";

    const reply_markup = {
      keyboard: [[this.buttons["work"]]],
    };

    this.bot.start((ctx) => ctx.reply(message, { reply_markup }));
  }

  private work() {
    this.bot.command("work", (ctx) => {
      const chatId = ctx.chat.id;

      const work = this.users[chatId] as Work;

      if (work) {
        let response = "U already working";
        response += `\nSince: ${work.getDateString()}`;
        response += "\nU can end session with /stop";

        ctx.reply(response);

        return;
      }

      this.users[chatId] = new Work();

      const reply_markup = {
        keyboard: [[this.buttons["rest"], this.buttons["stop"]]],
      };

      ctx.reply("Start working", { reply_markup });
    });
  }

  private rest() {
    this.bot.command("rest", (ctx) => {
      const chatId = ctx.chat.id;

      if (!this.users[chatId]) {
        ctx.reply("U not working currently");

        return;
      }

      ctx.reply("In progress...\nBut ofcourse U can rest");
    });
  }

  private stop() {
    this.bot.command("stop", (ctx) => {
      const chatId = ctx.chat.id;

      if (!this.users[chatId]) {
        ctx.reply("U not working now");

        return;
      }

      const work = this.users[chatId] as Work;
      delete this.users[chatId];

      let response = "Stop working\n";
      response += `Work duration: ${work.getDateDiff()}`;

      const reply_markup = {
        keyboard: [[this.buttons["work"]]],
      };

      ctx.reply(response, { reply_markup });
    });
  }

  public launch() {
    this.start();
    this.work();
    this.rest();
    this.stop();

    this.bot.launch();

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }
}
