import { config } from "dotenv";
import Bot from "./bot";
config()

const bot = new Bot()
bot.login(process.env.TOKEN)