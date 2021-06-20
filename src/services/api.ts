import axios from 'axios'
import Category from '../entities/Category'
import Episode from '../entities/Episode'

const api = axios.create({
  baseURL: 'https://appanimeplus.tk',
  headers: {
    'Content-type': 'application/json',
    'User-Agent': 'node-fetch/1.0',
  },
})

export default {
  ...api,
  getCategory: async (category: string) => {
    try {
      const { data } = await api.get<Category[]>(`/meuanimetv-40.php`, {
        params: {
          categoria: category,
        },
      })
      return data
    } catch (error) {
      console.log(
        `Houve um erro ao buscar a categoria ${category} na api animesbr`
      )
      return []
    }
  },
  getEpisode: async (episode: string) => {
    const { data } = await axios.get<Episode[]>(
      `https://appanimeplus.tk/meuanimetv-40.php?episodios=${episode}`,
      {
        headers: {
          'proxy-type': 'brazil',
        },
        proxy: { protocol: 'http', host: '185.86.150.41', port: 800 },
      }
    )

    return data[0]
  },
  getEpisodesFromAnime: async (anime_id: string) => {
    const { data } = await api.get<Episode[]>(
      `/meuanimetv-40.php?cat_id=${anime_id}`
    )
    return data
  },
  getAnime: async (anime_id: string) => {
    const { data } = await api.get<Category[]>(
      `/meuanimetv-40.php?info=${anime_id}`
    )
    return data[0]
  },
  getAnimeAnilist: async (anime_id: number) => {
    var queryRequest = `
    query ($id: Int) {
      Media (id: $id) {
        id,
        title {
          romaji
          english
          native
          userPreferred
        },
        type,
        format,
        genres,
        bannerImage,
        coverImage {
          extraLarge
          large
          medium
          color
        }
      }
    }
    `

    var variables = {
      id: anime_id,
    }

    const { data } = await axios.post(`https://graphql.anilist.co`, {
      query: queryRequest,
      variables,
    })

    return data
  },
  nextEpisode: async (episode_id: string, anime_id: string) => {
    const { data } = await api.get<Episode[] | null>(
      `/meuanimetv-40.php?episodios=${episode_id}&catid=${anime_id}&next`
    )
    return data && data[0]
  },
  previousEpisode: async (episode_id: string, anime_id: string) => {
    const { data } = await api.get<Episode[] | null>(
      `/meuanimetv-40.php?episodios=${episode_id}&catid=${anime_id}&previous`
    )
    return data && data[0]
  },
  searchAnime: async (query: string, category?: string) => {
    var queryRequest = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (search: $search, type: ANIME) {
          id,
          title {
            romaji
            english
            native
            userPreferred
          },
          type,
          format,
          genres,
          bannerImage,
          coverImage {
            extraLarge
            large
            medium
            color
          }
        }
      }
    }
    `

    var variables = {
      search: query,
      page: 1,
      perPage: 1,
    }

    const { data } = await axios.post(`https://graphql.anilist.co`, {
      query: queryRequest,
      variables,
    })

    return data
  },
  directSearchAnime: async (query: any) => {
    const { data } = await api.get<Category[]>(
      `https://appanimeplus.tk/meuanimetv-40.php?search=${query || ''}`
    )
    return data
  },
}
