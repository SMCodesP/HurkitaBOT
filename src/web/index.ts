import * as express from 'express'
import { red, green } from 'colors/safe'
import Routes from './routes'
import * as cors from 'cors'
import { Server } from 'http'

class Web {
  app: express.Express
  server: import('http').Server
  http: Server

  constructor(port: string | number) {
    this.app = express()

    this.app.set('port', process.env.PORT || 3333)

    this.app.use(cors({
      origin: ['https://www.animetempest.net', 'https://animetempest.net'],
    }))

    this.routes()
  }

  routes() {
    new Routes(this)
  }

  async init(http: Server, port: string | number) {
    this.http = http
    http.listen(port)
  }

  listenWeb(port: string | number) {
    return new Promise((res, rej) => {
      this.server = this.app.listen(port, () => {
        res(port)
      })
    })
  }
}

export default Web
