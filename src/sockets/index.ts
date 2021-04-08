import { Server } from 'http'
import * as path from 'path'
import * as socketIo from 'socket.io'

import registerEvents from '../utils/registerEvents'

class Socket {
  io: socketIo.Server

  constructor(http: Server) {
    this.io = require('socket.io')(http, {
      transport: ['websocket'],
      cors: {
        origin: ['https://otakutube.vercel.app', 'http://localhost:3000'],
      },
    })
    this.register()
  }

  register() {
    
    registerEvents(path.resolve(__dirname, 'events'), this.io)
  }
}

export default Socket
