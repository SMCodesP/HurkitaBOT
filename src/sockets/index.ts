import { Server } from 'http'
import * as path from 'path'
import * as socketIo from 'socket.io'

import registerEvents from '../utils/registerEvents'

class Socket {
  io: socketIo.Server

  constructor(http: Server) {
    this.io = require('socket.io')(http, {
      cors: {
        origin: ['https://www.animetempest.net', 'https://animetempest.net'],
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
