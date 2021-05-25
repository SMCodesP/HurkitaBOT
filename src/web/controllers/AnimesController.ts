import { Request, Response, Router } from 'express'
import * as db from 'quick.db'
import { Anime } from '../../entities/Anime'
import api from '../../services/api'
import { Controller } from '../structures/entities/Controller'

let animes: {
  [key: string]: Anime
} | null = db.get('anime') || null
let requesting = false

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getAnimes = (): Anime[] => {
  return Object.values(db.get('anime')) || []
}

class AnimesController extends Controller {
  constructor(register: any) {
    super(register, '/api/animes', {})
  }

  async get(req: Request, res: Response) {
    const {
      query = '',
      category = '',
      error,
    }: {
      query: string
      category: string
      error: string
    } = req.query as any

    let searched = getAnimes()
      .filter((anime) => {
        return !anime.category_name.toLowerCase().includes('animetv') &&
          category
          ? anime.anilist
            ? anime.anilist.genres
                .map((a) => a.toLowerCase())
                .includes(category.toLowerCase())
            : false
          : true
      })
      .filter((anime) =>
        anime.anilist
          ? anime.category_name
              .toLowerCase()
              .includes(String(query).toLowerCase()) ||
            (anime.anilist.title?.english &&
              anime.anilist.title?.english
                .toLowerCase()
                .includes(String(query).toLowerCase())) ||
            (anime.anilist.title?.native &&
              anime.anilist.title?.native
                .toLowerCase()
                .includes(String(query).toLowerCase())) ||
            (anime.anilist.title?.romaji &&
              anime.anilist.title?.romaji
                .toLowerCase()
                .includes(String(query).toLowerCase())) ||
            (anime.anilist.title?.userPreferred &&
              anime.anilist.title?.userPreferred
                .toLowerCase()
                .includes(String(query).toLowerCase()))
          : anime.category_name
              .toLowerCase()
              .includes(String(query).toLowerCase())
      )
      .filter(
        (anime) =>
          !anime.category_name.toLowerCase().includes('animetv') &&
          !anime.category_name.toLowerCase().includes('rede series')
      )

    searched =
      error !== undefined
        ? error === 'true'
          ? searched.filter((a) => a.error)
          : searched.filter((a) => !a.error)
        : searched

    res.json({
      searched: {
        errors: searched.filter((a) => a.error).length,
        success: searched.filter((a) => !a.error).length,
        results: searched.length,
      },
      results: searched,
    })

    const addAnimes = async () => {
      requesting = true
      console.time('category')

      for (const animeCategory of (await api.directSearchAnime('')).filter(
        (categoryFiltered) =>
          !Object.values(animes).some(
            (category) => String(category.id) === String(categoryFiltered.id)
          )
      )) {
        try {
          const {
            data: {
              Page: {
                media: [anime],
              },
            },
          } = await api.searchAnime(
            animeCategory.category_name
              .replace(new RegExp('dublado', 'ig'), '')
              .trim()
          )
          if (!anime) {
            console.log('Não achei ' + animeCategory.category_name)
            db.push(`anime.${animeCategory.id}`, {
              ...animeCategory,
              error: true,
            })
          } else {
            console.log(
              `${animeCategory.category_name} - ${anime.title.romaji} ${
                animeCategory.category_name !== anime.title.romaji &&
                animeCategory.category_name !== anime.title.english &&
                animeCategory.category_name !== anime.title.native &&
                animeCategory.category_name !== anime.title.userPreferred
              }`
            )
            db.push(`anime.${animeCategory.id}`, {
              ...animeCategory,
              anilist: anime,
              error:
                animeCategory.category_name
                  .replace(new RegExp('dublado', 'ig'), '')
                  .trim()
                  .toLowerCase() !== anime.title.romaji?.toLowerCase() &&
                animeCategory.category_name
                  .replace(new RegExp('dublado', 'ig'), '')
                  .trim()
                  .toLowerCase() !== anime.title.english?.toLowerCase() &&
                animeCategory.category_name
                  .replace(new RegExp('dublado', 'ig'), '')
                  .trim()
                  .toLowerCase() !== anime.title.native?.toLowerCase() &&
                animeCategory.category_name
                  .replace(new RegExp('dublado', 'ig'), '')
                  .trim()
                  .toLowerCase() !== anime.title.userPreferred?.toLowerCase(),
            })
          }
        } catch (error) {
          console.log(error)
          console.log(
            `Tentando novamente em: ${
              (Number(error.response.headers['x-ratelimit-reset']) -
                Math.trunc(new Date().valueOf() / 1000)) *
              1000
            }ms`
          )
          await timeout(
            (Number(error.response.headers['x-ratelimit-reset']) -
              Math.trunc(new Date().valueOf() / 1000)) *
              1000
          )
        }
      }
      console.timeEnd('category')
      requesting = false
    }

    if (!requesting) {
      addAnimes()
    }
  }
}

export default AnimesController
