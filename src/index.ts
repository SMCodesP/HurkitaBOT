import "./utils/customConsolePrefixes";

import { config } from "dotenv";
import Bot from "./bot";

config()

const bot: Bot = new Bot()
bot.login(process.env.TOKEN)
  .then(() => {
    console.log("O bot foi iniciado com sucesso!")
  }).catch((err) => {
    console.log("Houve um erro ao iniciar o bot.")
    console.log(err)
  })