import express = require('express')
import { resolve } from 'path'
import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import Web from '.'
import { io } from '..'

class Routes {
  router: express.Router

  constructor(client: Web) {
    client.app.use(express.json())
    client.app.use(
      '/static',
      express.static(resolve(__dirname, '..', '..', 'public'))
    )

    this.router = express.Router()

    this.router.get('/', async (req, res) =>
      res.sendFile(resolve(__dirname, '..', '..', 'views', 'index.html'))
    )

    this.router.get('/mask', async (req, res) => {
      const { query } = req.query

      const { data } = await axios.get(String(query) || '')

      res.json(data)
    })

    this.router.post('/login', async (req, res) => {
      if (process.env.PASSWORD_CLI === req.body.password) {
        const jwtToken = jwt.sign(
          {
            data: req.body.socket,
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )

        ;(io as any).sockets.sockets.get(req.body.socket).join('logging')

        return res.send(jwtToken)
      }

      return res.status(401).send()
    })

    client.app.use(this.router)
  }
}

export default Routes
