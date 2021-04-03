import { youtube_v3 } from 'googleapis'

export interface Song {
  title: string
  url: string
  responseData: youtube_v3.Schema$SearchResult | youtube_v3.Schema$Video
}
