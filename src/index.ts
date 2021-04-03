import { config } from 'dotenv'
import { customizeConsole } from './utils/customConsolePrefixes'
import { Server } from 'http'
import * as socketIo from 'socket.io'
import * as admin from 'firebase-admin'

import Bot from './bot'
import Web from './web'
import CLIClass from './cli'
import Progress from './web/structures/entities/Progress'
import firebaseAdmin from './lib/firebaseAdmin'

config()

class ServerIO extends socketIo.Server {
  socketsAccess: string[]
}

const web: Web = new Web(process.env.PORT || 3333)

const http: Server = require('http').Server(web.app)
const io: socketIo.Server = require('socket.io')(http, {
  transport: ['websocket'],
  cors: {
    origin: 'https://otakutube.vercel.app',
  },
})

const socketsProgress: Map<string, Progress> = new Map()

io.on('connection', (socket) => {
  socket.on('disconnect', async () => {
    const progress = socketsProgress.get(socket.id)
    if (progress) {
      const { firestore } = firebaseAdmin()
      const watchProgress = await firestore
        .collection('watch')
        .where('videoId', '==', progress.videoId)
        .where('userId', '==', progress.userId)
        .limit(1)
        .get()

      if (watchProgress.empty) {
        await firestore.collection('watch').add({
          ...progress,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
      } else {
        await firestore
          .collection('watch')
          .doc(watchProgress.docs[0].id)
          .update({
            ...progress,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          })
      }
      socketsProgress.delete(socket.id)
    }
  })

  socket.on('progress', (data: Progress) => {
    socketsProgress.set(socket.id, data)
  })
})

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
