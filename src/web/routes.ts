import * as express from 'express'
import { resolve } from 'path'
import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import Web from '.'
import { connection, io } from '..'
import requireDir = require('require-dir')
import { Anime } from '../entity/Anime'

class Routes {
  router: express.Router

  constructor(client: Web) {
    client.app.use(express.json())
    client.app.use(
      '/static',
      express.static(resolve(__dirname, '..', '..', 'public'))
    )

    this.router = express.Router()

    // this.router.use(async (req, res, next) => {
    //   ;(req as any).genres = await connection.getRepository(Anime).find()
    //   next()
    // })

    this.router.get('/', async (req, res) =>
      res.sendFile(resolve(__dirname, '..', '..', 'views', 'index.html'))
    )

    this.router.get('/download', function (req, res) {
      const file = resolve(__dirname, '..', '..', 'json.sqlite')
      res.download(file) // Set disposition and send it.
    })

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

    const dir = requireDir('./controllers', { recurse: true })

    const register = (
      type: 'post' | 'get' | 'put' | 'delete',
      route: string,
      exec: any
    ) => {
      this.router[type](route, exec)
    }

    for (const key in dir) {
      const Controller = dir[key].default
      new Controller(register)
    }

    client.app.use(this.router)
  }
}

export default Routes
