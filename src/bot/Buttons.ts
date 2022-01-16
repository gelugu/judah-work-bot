import { Markup } from "telegraf";
import {
  restButtonId,
  restButtonText,
  stopButtonId,
  stopButtonText,
  workButtonId,
  workButtonText,
} from "../constants/text";

export class Buttons {
  public work = Markup.button.callback(workButtonText, workButtonId);
  public rest = Markup.button.callback(restButtonText, restButtonId);
  public stop = Markup.button.callback(stopButtonText, stopButtonId);
}
