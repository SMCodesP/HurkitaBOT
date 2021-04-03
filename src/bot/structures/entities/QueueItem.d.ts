import {
  VoiceConnection,
  TextChannel,
  DMChannel,
  NewsChannel,
  VoiceChannel,
} from 'discord.js'
import { Song } from './Song'

export interface QueueItem {
  textChannel: TextChannel | DMChannel | NewsChannel
  voiceChannel: VoiceChannel
  connection: VoiceConnection
  songs: Array<Song>
  volume: number
  defaultVolume: number
  playing: boolean
}
