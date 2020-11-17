import * as express from 'express'

class Web {
  app: express.Express;

  constructor() {
    this.app = express()

    this.routes()
  }

  routes() {
    this.app.get('/', (req, res) => {
      return res.send('Status » Ok')
    })
  }

  init(port: string | number) {
    this.app.listen(port)
  }
}

export default Web
