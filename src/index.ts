import micro from "micro";

import { Bot } from "./bot/Bot";

const bot = new Bot();

bot.launch();

// prevent Heroku fail on port biding
const port = process.env.PORT;
if (port) {
  const server = micro(() => {
    const botName = "@judahworkbot";
    return `Join telegram bot <a href=\"tg.me/${botName}\">${botName}</a>`;
  });
  server.listen(port, () => {
    console.log(`Server started on ${port} (Heroku)`);
  });
}
