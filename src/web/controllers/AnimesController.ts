import { Request, Response } from 'express'
import { Controller } from '../structures/entities/Controller'
import { getConnection } from 'typeorm'
import { Anime } from '../../entity/Anime'

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
    }: {
      query: string
      category: string
      error: boolean
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
        .cache(false)
        .getMany()

      return res.json(
        await connection.getRepository(Anime).findByIds(
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
            .map((anime) => anime.id),
          {
            cache: true,
          }
        )
      )
    }

    try {
      let searched = await connection
        .createQueryBuilder(Anime, 'anime')
        .select()
        .where(`COALESCE(category_name, '') ILIKE :searchQuery`, {
          searchQuery: `%${query}%`,
        })
        .orWhere(`COALESCE(title_romaji, '') ILIKE :searchQuery`, {
          searchQuery: `%${query}%`,
        })
        .orWhere(`COALESCE(title_english, '') ILIKE :searchQuery`, {
          searchQuery: `%${query}%`,
        })
        .orWhere(`COALESCE(title_native, '') ILIKE :searchQuery`, {
          searchQuery: `%${query}%`,
        })
        .orWhere(`COALESCE(sinopse, '') ILIKE :searchQuery`, {
          searchQuery: `%${query}%`,
        })
        .orderBy('anime.id', 'ASC')
        .limit(limit > 50 ? 50 : limit)
        .offset((page - 1) * limit)
        .cache(true)
        .getMany()

      return res.json(searched.sort((a, b) => a.id - b.id))
    } catch (error) {
      console.error(error)
      return res.status(400).send('Error')
    }

    // const animeRepository = connection.getRepository(Anime)

    // const genres = await connection.manager.find(Genre, {
    //   cache: true,
    // })
    // const animes = await animeRepository.find()
    // console.log(animes.length)
    // console.log(
    //   animes.filter((anime) => !anime.genres || !anime.sinopse).length
    // )
    // animes
    //   .filter((anime) => !anime.genres || !anime.sinopse)
    //   .forEach(async (anime) => {
    //     const { category_genres, category_description } = await api.getAnime(
    //       String(anime.id)
    //     )
    //     console.log(`${anime.id} requisitado!`)
    //     // console.log(category_description)
    //     await animeRepository.update(anime, {
    //       ...anime,
    //       genres: category_genres.split(',').map((genre) => genre.trim()),
    //       sinopse: category_description,
    //     })
    //     console.log(`${anime.id} atualizado!`)
    //   })

    // const addAnimes = async () => {
    //   requesting = true
    //   console.time('category')

    //   for (const animeCategory of (await api.directSearchAnime('')).filter(
    //     (categoryFiltered) =>
    //       !Object.values(animes).some(
    //         (category) => String(category.id) === String(categoryFiltered.id)
    //       )
    //   )) {
    //     try {
    // const {
    //   data: {
    //     Page: {
    //       media: [anime],
    //     },
    //   },
    // } = await api.searchAnime(
    //   animeCategory.category_name
    //     .replace(new RegExp('dublado', 'ig'), '')
    //     .trim()
    // )
    //       if (!anime) {
    //         console.log('Não achei ' + animeCategory.category_name)
    //         db.push(`anime.${animeCategory.id}`, {
    //           ...animeCategory,
    //           error: true,
    //         })
    //       } else {
    //         console.log(
    //           `${animeCategory.category_name} - ${anime.title.romaji} ${
    //             animeCategory.category_name !== anime.title.romaji &&
    //             animeCategory.category_name !== anime.title.english &&
    //             animeCategory.category_name !== anime.title.native &&
    //             animeCategory.category_name !== anime.title.userPreferred
    //           }`
    //         )
    //         db.push(`anime.${animeCategory.id}`, {
    //           ...animeCategory,
    //           anilist: anime,
    //           error:
    //             animeCategory.category_name
    //               .replace(new RegExp('dublado', 'ig'), '')
    //               .trim()
    //               .toLowerCase() !== anime.title.romaji?.toLowerCase() &&
    //             animeCategory.category_name
    //               .replace(new RegExp('dublado', 'ig'), '')
    //               .trim()
    //               .toLowerCase() !== anime.title.english?.toLowerCase() &&
    //             animeCategory.category_name
    //               .replace(new RegExp('dublado', 'ig'), '')
    //               .trim()
    //               .toLowerCase() !== anime.title.native?.toLowerCase() &&
    //             animeCategory.category_name
    //               .replace(new RegExp('dublado', 'ig'), '')
    //               .trim()
    //               .toLowerCase() !== anime.title.userPreferred?.toLowerCase(),
    //         })
    //       }
    //     } catch (error) {
    //       console.log(error)
    //       console.log(
    //         `Tentando novamente em: ${
    //           (Number(error.response.headers['x-ratelimit-reset']) -
    //             Math.trunc(new Date().valueOf() / 1000)) *
    //           1000
    //         }ms`
    //       )
    //       await timeout(
    //         (Number(error.response.headers['x-ratelimit-reset']) -
    //           Math.trunc(new Date().valueOf() / 1000)) *
    //           1000
    //       )
    //     }
    //   }
    //   console.timeEnd('category')
    //   requesting = false
    // }

    // if (!requesting) {
    //   // addAnimes()
    // }
  }
}

export default AnimesController
