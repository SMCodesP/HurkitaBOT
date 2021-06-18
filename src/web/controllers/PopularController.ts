import { Request, Response } from 'express'
import { Controller } from '../structures/entities/Controller'
import { getConnection } from 'typeorm'
import { Anime } from '../../entity/Anime'
import getRandom from '../../utils/getRandom'
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
      '/meuanimetv-40.php?populares'
    )

    const connection = getConnection()

    return res.json(
      await connection
        .getRepository(Anime)
        .findByIds(
          getRandom(animesPopular, Math.min(limit, animesPopular.length))
            .map((anime) => anime.id),
          {
            cache: true,
          }
        )
    )
  }
}

export default PopularController
