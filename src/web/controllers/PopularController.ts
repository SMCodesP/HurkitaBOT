import { Request, Response } from 'express'
import { Controller } from '../structures/entities/Controller'
import { getConnection } from 'typeorm'
import { Anime } from '../../entity/Anime'
import api from '../../services/api'
import Category from '../../entities/Category'

class PopularController extends Controller {
  constructor(register: any) {
    super(register, '/api/popular', {})
  }

  async get(req: Request, res: Response) {
    const {
      limit = 15,
    }: {
      limit: number
    } = req.query as any

    let { data: animesPopular } = await api.get<Category[]>(
      '/api-animesbr-10.php?populares'
    )
    const connection = getConnection()

    return res.json(
      await connection
        .getRepository(Anime)
        .findByIds(
          animesPopular
            .slice(0, limit)
            .map((anime) => anime.id),
          {
            cache: true,
          }
        )
    )
  }
}

export default PopularController
