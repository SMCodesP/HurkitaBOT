import express = require('express')
import { resolve } from 'path'
import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import * as db from 'quick.db'
import Web from '.'
import { io } from '..'
import api from '../services/api'

let animes = db.get('animes') || {}
let requesting = {}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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

    this.router.get('/api/search', async (req, res) => {
      const {
        query = '',
        category = 'completely',
      }: {
        query: string
        category: string
      } = req.query as any

      if (!animes[category] && !requesting[category]) {
        if (category !== 'completely') {
          const items = await api.getCategory(String(category))
          res.json(
            items.filter(
              (item) =>
                item.category_name
                  .toUpperCase()
                  .indexOf(String(query).toUpperCase()) > -1 &&
                !item.category_name.toLowerCase().includes('animetv')
            )
          )
        } else {
          const searched = await api.directSearchAnime(query)
          res.json(searched)
        }
      } else {
        const searched = db
          .get(`animes.${category}`)
          .filter(
            (anime) =>
              !anime.category_name.toLowerCase().includes('animetv') &&
              anime.category_name
                .toLowerCase()
                .includes(String(query).toLowerCase())
          )
        res.json(searched)
      }

      const addAnimes = async () => {
        requesting[category] = true
        console.time(category)
        for (const [idx, animeCategory] of (category === 'completely'
          ? await api.directSearchAnime('')
          : await api.getCategory(category)
        )
          .filter((categoryFiltered) =>
            animes[category]
              ? !animes[category].some(
                  (category) =>
                    category.id === categoryFiltered.id || !!category.image_alt
                )
              : true
          )
          .entries()) {
          try {
            const { data: anime } = await axios.get(
              `https://api.jikan.moe/v3/search/anime`,
              {
                params: {
                  q: animeCategory.category_name,
                  limit: 1,
                },
              }
            )
            if (!anime || anime.results.length === 0)
              throw new Error('não existe')
            console.timeLog(category)
            console.log(`${idx + 1} - ${animeCategory.category_name}`)
            db.push(`animes.${category}`, {
              ...animeCategory,
              image_alt: anime.results[0]!.image_url,
            })
          } catch (error) {
            console.error(error)
            console.error(`${idx + 1} - Error ${animeCategory.category_name}`)
            db.push(`animes.${category}`, animeCategory)
          }
          await timeout(1000)
        }
        console.timeEnd(category)
        requesting[category] = false
      }

      if (!requesting[category]) {
        addAnimes()
      }
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
