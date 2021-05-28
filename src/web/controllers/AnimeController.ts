import { Request, Response } from 'express'
import { getConnection } from 'typeorm'
import { AnimeType } from '../../entities/Anime'
import { Controller } from '../structures/entities/Controller'
import { Anime } from '../../entity/Anime'

class AnimeController extends Controller {
  constructor(register) {
    super(register, '/api/anime/:id', {})
  }

  async get(req: Request, res: Response) {
    const { id } = req.params

    try {
      const anime = await getConnection().getRepository(Anime).findOne(id)

      return res.json(anime)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }

  async put(req: Request, res: Response) {
    const {
      anime: animeUpdate,
    }: {
      anime: AnimeType
    } = req.body
    const { id } = req.params
    const animeRepository = getConnection().getRepository(Anime)

    try {
      const anime = await animeRepository.findOne(id)
      //   animeUpdate,
      //   type: animeUpdate.anilist.type,
      //   format: animeUpdate.anilist.format,
      //   bannerImage: animeUpdate.anilist.bannerImage,
      //   category_image: animeUpdate.category_image,
      //   anilist_id: animeUpdate.anilist.id,
      //   category_name: animeUpdate.category_name,
      //   error: animeUpdate.error,
      //   title_english: animeUpdate.anilist.title.english,
      //   title_romaji: animeUpdate.anilist.title.romaji,
      //   title_native: animeUpdate.anilist.title.native,
      //   title_userPreferred: animeUpdate.anilist.title.userPreferred,
      //   coverImage_color: animeUpdate.anilist.coverImage.color,
      //   coverImage_medium: animeUpdate.anilist.coverImage.medium,
      //   coverImage_large: animeUpdate.anilist.coverImage.large,
      //   coverImage_extraLarge: animeUpdate.anilist.coverImage.extraLarge,
      // })

      return res.json(await animeRepository.update(anime, animeUpdate))
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }
}

export default AnimeController
