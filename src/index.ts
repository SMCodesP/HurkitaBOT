import "./utils/customConsolePrefixes";

import { config } from "dotenv";

import Bot from "./bot";
import Web from "./web"
import CLIClass from "./cli"

(async () => {
    config()

    const bot: Bot = new Bot()
    await bot.init(process.env.TOKEN)
    
    const web: Web = new Web()
    await web.init(process.env.PORT || 3333)
    
    const CLI: CLIClass = new CLIClass()
    CLI.init()
})()