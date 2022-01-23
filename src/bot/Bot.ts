import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import { addNewWorkSession, getCurrentUserSession, stopUserSession } from "../firebase/database/work";

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
  private buttons: Buttons;

  constructor(token: string = process.env.TOKEN) {
    this.bot = new Telegraf(token);
    this.buttons = new Buttons();
  }

  private start() {
    const keyboard = Markup.inlineKeyboard([[this.buttons.work]]);

    this.bot.start((ctx) => {
      ctx.replyWithHTML(startText, keyboard);
    });
  }

  private async work(ctx) {
    const chatId = ctx.chat.id;

    const currentSession = await getCurrentUserSession(chatId);

    if (currentSession) {
      const work = new Work(new Date(currentSession))
      await ctx.replyWithHTML(alreadyWoringText(work.getDateString()));
      return;
    }

    addNewWorkSession(chatId, {
      start: Date.now(),
    })

    const keyboard = Markup.inlineKeyboard([
      [this.buttons.rest, this.buttons.stop],
    ]);

    await ctx.replyWithHTML(workText, keyboard);
  }

  private async rest(ctx) {
    const chatId = ctx.chat.id;

    const currentSession = await getCurrentUserSession(chatId);

    if (!currentSession) {
      ctx.replyWithHTML(restNotWorkingText);
      return;
    }

    ctx.replyWithHTML(restText);
  }

  private async stop(ctx) {
    const chatId = ctx.chat.id;

    const currentSession = await getCurrentUserSession(chatId);

    if (!currentSession) {
      ctx.replyWithHTML(stopNotWorkingText);
      return;
    }

    stopUserSession(chatId)

    const work = new Work(new Date(currentSession))

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
