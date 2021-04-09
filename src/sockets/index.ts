import { Server } from 'http'
import * as path from 'path'
import * as socketIo from 'socket.io'

import registerEvents from '../utils/registerEvents'

class Socket {
  io: socketIo.Server

  constructor(http: Server) {
    this.io = require('socket.io')(http, {
      cors: {
        origin: ['https://www.otakutube.tk', 'https://otakutube.tk', 'https://otakutube.vercel.app', 'http://localhost:3000', 'https://3333-black-shrimp-bp9d7t8g.ws-us03.gitpod.io'],
      },
    })
    this.register()
  }

  register() {
    console.log('register')
    registerEvents(path.resolve(__dirname, 'events'), this.io)
  }
}

export default Socket
