import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import { Work } from "../work/Wokr";
import { Buttons } from "./Buttons";
import {
  alreadyWoringText,
  restButtonId,
  restNotWorkingText,
  restText,
  startText,
  stopButtonId,
  stopNotWorkingText,
  stopText,
  workButtonId,
  workText,
} from "../constants/text";

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
    const keyboard = Markup.inlineKeyboard([[this.buttons.work]]);

    this.bot.start((ctx) => ctx.replyWithHTML(startText, keyboard));
  }

  private async work(ctx) {
    const chatId = ctx.chat.id;

    const work = this.users[chatId] as Work;

    if (work) {
      await ctx.replyWithHTML(alreadyWoringText(work.getDateString()));
      return;
    }

    this.users[chatId] = new Work();

    const keyboard = Markup.inlineKeyboard([
      [this.buttons.rest, this.buttons.stop],
    ]);

    await ctx.replyWithHTML(workText, keyboard);
  }

  private rest(ctx) {
    const chatId = ctx.chat.id;

    if (!this.users[chatId]) {
      ctx.replyWithHTML(restNotWorkingText);
      return;
    }

    ctx.replyWithHTML(restText);
  }

  private stop(ctx) {
    const chatId = ctx.chat.id;

    if (!this.users[chatId]) {
      ctx.replyWithHTML(stopNotWorkingText);

      return;
    }

    const work = this.users[chatId] as Work;
    delete this.users[chatId];

    const keyboard = Markup.inlineKeyboard([[this.buttons.work]]);

    ctx.replyWithHTML(stopText(work.getDateDiff()), keyboard);
  }

  public launch() {
    this.start();

    this.bot.action(workButtonId, (ctx) => this.work(ctx));

    this.bot.action(restButtonId, (ctx) => this.rest(ctx));

    this.bot.action(stopButtonId, (ctx) => this.stop(ctx));

    this.bot.launch();

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }
}
