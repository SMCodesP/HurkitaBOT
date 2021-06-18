import { Request, Response } from 'express'
import { Controller } from '../structures/entities/Controller'
import { getConnection } from 'typeorm'
import { Anime } from '../../entity/Anime'
import api from '../../services/api'

class AnimesController extends Controller {
  constructor(register: any) {
    super(register, '/api/update', {})
  }

  async get(req: Request, res: Response) {
  	try {
	    const connection = getConnection()

	    const animeRepository = connection.getRepository(Anime)

	    const animes = await animeRepository.find()

	    const addAnimes = async () => {
	      console.time('category')
	      let data = [];

	      for (let animeCategory of (await api.directSearchAnime('')).filter(
	        (categoryFiltered) =>
	          !Object.values(animes).some(
	            (category) => String(category.id) === String(categoryFiltered.id)
	          )
	      )) {
	      	if (!['2', '33440', '33473', '33474', '94', '1'].includes(animeCategory.id)) {
		        try {
		        	animeCategory = await api.getAnime(animeCategory.id);
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

		          // console.log(anime)

		          const animeData = new Anime()

		          // console.log(animeCategory)

		          animeData.id = Number(animeCategory.id);
		          animeData.category_name = animeCategory.category_name;
		          animeData.sinopse = animeCategory.category_description;
		          animeData.category_image = animeCategory.category_image;
		          animeData.genres = animeCategory.category_genres.split(',').map(genre => genre.toLowerCase().trim());

		          if (anime) {
		          	const title = animeCategory.category_name.toLowerCase().replace(new RegExp('dublado', 'ig'), '').trim();
  		          animeData.error = title !== anime.title.romaji.toLowerCase() && title !== anime.title.english.toLowerCase() && title !== anime.title.native.toLowerCase() && title !== anime.title.userPreferred.toLowerCase();
  		          animeData.anilist_id = anime.id || null;
  		          animeData.type = anime.type || null;
  		          animeData.format = anime.format || null;
  		          animeData.bannerImage = anime.bannerImage;
  		          animeData.coverImage_color = anime.coverImage.color || null;
  		          animeData.coverImage_extraLarge = anime.coverImage.extraLarge || null;
  		          animeData.coverImage_large = anime.coverImage.large || null;
  		          animeData.coverImage_medium = anime.coverImage.medium || null;
  		          animeData.title_english = anime.title.english || null;
  		          animeData.title_romaji = anime.title.romaji || null;
  		          animeData.title_native = anime.title.native || null;
  		          animeData.title_userPreferred = anime.title.userPreferred || null;
		          } else {
		          	animeData.error = true;
		          }

		          data.push(animeData)
		        } catch (error) {
		          console.log(error)
		          console.log(
		            `Tentando novamente em: ${
		              (Number(error.response.headers['x-ratelimit-reset']) -
		                Math.trunc(new Date().valueOf() / 1000)) *
		              1000
		            }ms`
		          )
		        }
	      	}
	      }

	      console.timeEnd('category')
		    animeRepository.save(data);
	      return data;
	    }

	    const data = await addAnimes()
	    return res.json(data)
  	} catch (error) {
  		console.log(error)
  		return res.status(400).json(error)
  	}
  }
}

export default AnimesController
