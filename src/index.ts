import { config } from "dotenv";
import Bot from "./bot";

import getNowTime from "./utils/getNowTime";
config()

const bot: Bot = new Bot()
bot.login(process.env.TOKEN)
  .then(() => {
    console.log(getNowTime() + `O bot foi iniciado com sucesso!`)
  }).catch((err) => {
    console.log(getNowTime() + 'Houve um erro ao iniciar o bot.')
    console.log(err)
  })