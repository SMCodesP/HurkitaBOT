export interface AnimeType {
  id: number
  category_name: string
  category_image: string
  category_description?: string
  category_genres?: string
  ano?: string
  count?: string
  off?: string
  anilist?: {
    id: number
    title: {
      romaji: string | null
      english: string | null
      native: string | null
      userPreferred: string | null
    }
    type: string
    format: string
    genres: string[]
    bannerImage: string | null
    coverImage: {
      extraLarge: string
      large: string
      medium: string
      color: string
    }
  }
  error: boolean
}
