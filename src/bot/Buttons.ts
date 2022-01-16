import { Markup } from "telegraf";

export class Buttons {
  public work = Markup.button.callback("Start work session", "work_button");
  public rest = Markup.button.callback("Take a timeout", "rest_button");
  public stop = Markup.button.callback("Stop work session", "stop_button");
}
