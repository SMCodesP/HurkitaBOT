import "./utils/customConsolePrefixes";

import { config } from "dotenv";
import { green, red } from "colors/safe";

import Bot from "./bot";

config()

const bot: Bot = new Bot()
bot.login(process.env.TOKEN)
  .then(() => {
    console.log(`${green("[Sucesso]")} O bot foi iniciado!`)
  }).catch((err) => {
    console.log(`${red("[Error]")} Houve um erro ao iniciar o bot.`)
    console.log(err)
  })