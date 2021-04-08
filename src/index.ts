import { config } from 'dotenv'
import { customizeConsole } from './utils/customConsolePrefixes'
import { Server } from 'http'

import Bot from './bot'
import Web from './web'
import CLIClass from './cli'
import Progress from './web/structures/entities/Progress'
import Socket from './sockets'

config()

const web: Web = new Web(process.env.PORT || 3333)

const http: Server = require('http').Server(web.app)
const { io } = new Socket(http)
// const io: socketIo.Server = require('socket.io')(http, {
//   transport: ['websocket'],
//   cors: {
//     origin: ['https://otakutube.vercel.app', 'http://localhost:3000'],
//   },
// })

const socketsProgress: Map<string, Progress> = new Map()

// io.on('connection', (socket) => {
//   socket.on('disconnect', async () => {
//   })

//   socket.on('progress', (data: Progress) => {
//     socketsProgress.set(socket.id, data)
//   })
// })

customizeConsole(io)

const bot: Bot = new Bot()
const cli: CLIClass = new CLIClass()

async function load() {
  await web.init(http, process.env.PORT || 3333)
  await bot.init(process.env.TOKEN)
  cli.init()
}
load()

export { web, bot, cli, io }
