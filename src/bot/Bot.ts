import { buffer } from "stream/consumers";
import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import { Work } from "../work/Wokr";
import { Buttons } from "./Buttons";

export class Bot {
  private bot: Telegraf<Context<Update>>;
  private users: object;
  private buttons: Buttons;

  constructor(token: string = process.env.TOKEN) {
    this.bot = new Telegraf(token);
    this.users = {};
    this.buttons = new Buttons();
  }

  private start() {
    const message =
      "/work to start\n/rest to 10 minut timeout\n/stop to stop work";

    const keyboard = Markup.inlineKeyboard([[this.buttons.work]])

    this.bot.start((ctx) => ctx.reply(message, keyboard));
  }

  private async work(ctx) {
    const chatId = ctx.chat.id;

    const work = this.users[chatId] as Work;

    if (work) {
      let response = "U already working";
      response += `\nSince: ${work.getDateString()}`;
      response += "\nU can end session with /stop";

      await ctx.reply(response);

      return;
    }

    this.users[chatId] = new Work();

    const keyboard = Markup.inlineKeyboard([[this.buttons.rest, this.buttons.stop]])

    await ctx.reply("Start working", keyboard);
  }

  private rest(ctx) {
    const chatId = ctx.chat.id;

    if (!this.users[chatId]) {
      ctx.reply("U not working currently");

      return;
    }

    ctx.reply("In progress...\nBut ofcourse U can rest");
  }

  private stop(ctx) {
    const chatId = ctx.chat.id;

    if (!this.users[chatId]) {
      ctx.reply("U not working now");

      return;
    }

    const work = this.users[chatId] as Work;
    delete this.users[chatId];

    let response = "Stop working\n";
    response += `Work duration: ${work.getDateDiff()}`;

    const keyboard = Markup.inlineKeyboard([[this.buttons.work]])

    ctx.reply(response, keyboard);
  }

  public launch() {
    this.start();

    this.bot.action("work_button", (ctx) => this.work(ctx));

    this.bot.action("rest_button", (ctx) => this.rest(ctx));

    this.bot.action("stop_button", (ctx) => this.stop(ctx));

    this.bot.launch();

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }
}
