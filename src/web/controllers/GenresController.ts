import { Request, Response } from 'express'
import { connection } from '../..'
import { Anime } from '../../entity/Anime'
import { Controller } from '../structures/entities/Controller'
import api from '../../services/api'

class GenresController extends Controller {
  constructor(register) {
    super(register, '/api/genres/:genres', {})
  }

  async get(req: Request, res: Response) {
    const {
      page = 1,
      limit = 50,
      key = '',
    }: {
      limit: number
      page: number
      key: string
    } = req.query as any

    const { genres } = req.params

    const querySelector = await connection.createQueryBuilder(Anime, 'anime')
      .select()
      .orderBy('anime.id', 'DESC')
      .where('genres && ARRAY[:genres]', {
        genres,
      })
      .limit(limit > 50 && key !== process.env.API_KEY ? 50 : limit)
      .offset((page - 1) * limit)
      .cache(true)
      .getMany()

    return res.json(querySelector)
  }
}

export default GenresController
