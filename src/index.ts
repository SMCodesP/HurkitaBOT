import "./utils/customConsolePrefixes";

import { config } from "dotenv";

import Bot from "./bot";
import Web from "./web"
import CLIClass from "./cli"

config()

const bot: Bot = new Bot()
const web: Web = new Web()
const cli: CLIClass = new CLIClass()

async function load() {
    await bot.init(process.env.TOKEN)
    await web.init(process.env.PORT || 3333)
    cli.init()
}
load()

export {
    web,
    bot,
    cli
}