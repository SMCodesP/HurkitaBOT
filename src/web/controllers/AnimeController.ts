import { Request, Response } from 'express'
import * as db from 'quick.db'
import { Controller } from '../structures/entities/Controller'

class AnimeController extends Controller {
  constructor(register) {
    super(register, '/api/anime/:id', {})
  }

  get(req: Request, res: Response) {
    const { id } = req.params

    return res.json(db.get(`anime.${id}`))
  }

  put(req: Request, res: Response) {
    const { anime } = req.body
    const { id } = req.params

    db.set(`anime.${id}`, anime)

    return res.status(202).end()
  }
}

export default AnimeController
