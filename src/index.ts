import { config } from 'dotenv'
import { Server } from 'http'

import Bot from './bot'
import Web from './web'
import CLIClass from './cli'
import Socket from './sockets'

config()

const web: Web = new Web(process.env.PORT || 3333)

const http: Server = require('http').Server(web.app)
const { io } = new Socket(http)

const bot: Bot = new Bot()
const cli: CLIClass = new CLIClass()

async function load() {
  await web.init(http, process.env.PORT || 3333)
  await bot.init(process.env.TOKEN)
  cli.init()
}
load()

export { web, bot, cli, io }
