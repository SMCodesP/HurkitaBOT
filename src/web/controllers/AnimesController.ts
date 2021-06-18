import { Request, Response } from 'express'
import { Controller } from '../structures/entities/Controller'
import { getConnection } from 'typeorm'
import { Anime } from '../../entity/Anime'
import api from '../../services/api'

class AnimesController extends Controller {
  constructor(register: any) {
    super(register, '/api/animes', {})
  }

  async get(req: Request, res: Response) {
    const {
      query = '',
      category = '',
      error,
      page = 1,
      limit = 50,
      animeId = null,
      key = '',
    }: {
      query: string
      category: string
      error: string
      key: string
      limit: number
      page: number
      animeId: number
    } = req.query as any

    const connection = getConnection()

    if (animeId) {
      const animes = await connection
        .createQueryBuilder(Anime, 'anime')
        .select(['anime.id'])
        .where('error = :error', { error })
        .orderBy('anime.id', 'DESC')
        .cache(false)
        .getMany()

      return res.json(
        animes
          .slice(
            animes.findIndex(
              (anime) => Number(anime.id) === Number(animeId)
            ) -
              5 <
              0
              ? 0
              : animes.findIndex(
                  (anime) => Number(anime.id) === Number(animeId)
                ) - 5,
            animes.findIndex(
              (anime) => Number(anime.id) === Number(animeId)
            ) + 6
          )
          .map((anime) => anime)
      )
    }

    try {
      let querySelector = connection.createQueryBuilder(Anime, 'anime').select()
      const querySearch =
        `(COALESCE(category_name, '') ILIKE :searchQuery OR COALESCE(title_romaji, '') ILIKE :searchQuery OR COALESCE(title_english, '') ILIKE :searchQuery OR COALESCE(title_native, '') ILIKE :searchQuery OR COALESCE(sinopse, '') ILIKE :searchQuery)` +
        (error !== undefined ? ' AND error = :error' : '')

      if (category) {
        querySelector = querySelector
          .where('genres && ARRAY[:genres]', {
            genres: category,
          })
          .andWhere(querySearch, {
            searchQuery: `%${query}%`,
            ...(error !== undefined ? { error: error.toLowerCase() } : {}),
          })
      } else {
        querySelector = querySelector.where(querySearch, {
          searchQuery: `%${query}%`,
          ...(error !== undefined ? { error: error.toLowerCase() } : {}),
        })
      }

      return res.json(
        await querySelector
          .orderBy('anime.id', 'DESC')
          .limit(limit > 50 && key !== process.env.API_KEY ? 50 : limit)
          .offset((page - 1) * limit)
          .cache(true)
          .getMany()
      )
    } catch (error) {
      console.error(error)
      return res.status(400).send('Error')
    }
  }
}

export default AnimesController
