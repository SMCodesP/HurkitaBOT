import "./utils/customConsolePrefixes";

import { config } from "dotenv";

import Bot from "./bot";
import Web from "./web"

config()

const bot: Bot = new Bot()
bot.init(process.env.TOKEN)

const web: Web = new Web()
web.init(process.env.PORT || 3333)
