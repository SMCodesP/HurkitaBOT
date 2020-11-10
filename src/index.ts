import "./utils/customConsolePrefixes";

import { config } from "dotenv";

import Bot from "./bot";

config()

const bot: Bot = new Bot()
bot.init(process.env.TOKEN)
