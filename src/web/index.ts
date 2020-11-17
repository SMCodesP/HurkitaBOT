import express from 'express'

class Web {
  constructor() {
    this.app = express()

    this.routes()
  }

  routes() {
    this.app.get('/', (req, res) => {
      return res.send('Status » Ok')
    })
  }

  listen(port) {
    this.app.listen(port)
  }
}

export default Web
