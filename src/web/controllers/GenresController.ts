import { Request, Response } from 'express'
import { connection } from '../..'
import { Genre } from '../../entity/Genre'
import { Controller } from '../structures/entities/Controller'

class GenresController extends Controller {
  constructor(register) {
    super(register, '/api/genres', {})
  }

  async get(_req: Request, res: Response) {
    return res.json(
      await connection.manager.find(Genre, {
        cache: true,
      })
    )
  }
}

export default GenresController
