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

  async get(_req: Request, res: Response) {
    let { data: animesPopular } = await api.get<Category[]>(
      '/api-animesbr-10.php?populares'
    )
    const connection = getConnection()

    return res.json(
      await connection.getRepository(Anime).findByIds(
        animesPopular.map((anime) => anime.id),
        {
          cache: true,
        }
      )
    )
  }
}

export default PopularController
