import * as express from 'express'
import { red, green } from "colors/safe";
import { promisify } from "util";

class Web {
  app: express.Express;
  server: import("http").Server;

  constructor() {
    this.app = express()

    this.routes()
  }

  routes() {
    this.app.get('/', (req, res) => {
      return res.send('Status » Ok')
    })
  }

  async init(port: string | number) {
    await this.listenWeb(port)
    console.web(`${green('[Sucesso]')} Servidor web iniciado na porta ${red(String(port))}!`)
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
