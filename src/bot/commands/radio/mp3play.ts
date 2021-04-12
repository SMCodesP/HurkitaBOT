import { Message } from 'discord.js'
import { Command } from 'discord-akairo'

import { BotClientTypes } from '../../'
import { QueueItem } from '../../structures/entities/QueueItem'
import { Song } from '../../structures/entities/Song'
import getPrefix from '../../../utils/getPrefix'
import play from '../../../utils/play'
import { youtube_v3 } from 'googleapis'

class Mp3Play extends Command {
  client: BotClientTypes

  constructor() {
    super('mp3play', {
      aliases: ['mp3play', 'mp3tocar'],
      category: '📻 Mp3 rádio | mp3',
      channel: 'guild',
      description: {
        content: 'Comando para escutar uma música/podcast!',
        metadata: 'Mp3 play; start; musica; music; podcast; tocar; música',
        usage: '[command] [Texto para pesquisa de música/podcast]',
        examples: ['[command] podcast discord'],
      },
      args: [
        {
          id: 'searchQuery',
          match: 'content',
        },
      ],
    })
  }

  async exec(message: Message, { searchQuery }: { searchQuery: string }) {
    if (!searchQuery)
      return message.util.reply(
        `sintaxe incorreta, você deve usar o comando dessa forma \`${getPrefix(
          message.guild.id
        )}${this.id} [Texto de pesquisa]\`.`
      )

    const voiceChannel = message.member.voice.channel

    if (!voiceChannel)
      return message.util.reply(`você não está conectado em um canal de voz.`)
    const permissionsOfVoiceChannel = voiceChannel.permissionsFor(
      message.client.user
    )

    if (
      !permissionsOfVoiceChannel.has('CONNECT') ||
      !permissionsOfVoiceChannel.has('SPEAK')
    )
      return message.util.reply(
        `não tenho permissão para tocar música nesse canal de voz.`
      )

    try {
      let responseData:
        | youtube_v3.Schema$SearchListResponse
        | youtube_v3.Schema$VideoListResponse
      let song: Song
      let videoID = this.youtube_parser_link(searchQuery)

      if (videoID === false) {
        const { data } = await this.client.youtube.search.list({
          part: ['snippet'],
          q: searchQuery,
          type: ['video'],
          maxResults: 1,
        })
        responseData = data
        song = {
          title: data.items[0].snippet.title,
          url: `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`,
          responseData: data.items[0],
        }
      } else {
        const { data } = await this.client.youtube.videos.list({
          part: ['snippet'],
          id: [videoID.toString()],
        })

        responseData = data
        song = {
          title: data.items[0].snippet.title,
          url: `https://www.youtube.com/watch?v=${data.items[0].id}`,
          responseData: responseData.items[0],
        }
      }

      if (!song)
        return message.util.reply(
          `nenhum conteúdo encontrado com o texto digitado.`
        )

      const serverQueueSongs = this.client.queueSongs.get(message.guild.id)

      if (!serverQueueSongs) {
        const queueContruct: QueueItem = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 2,
          defaultVolume: 2,
          playing: true,
        }

        this.client.queueSongs.set(message.guild.id, queueContruct)

        queueContruct.songs.push(song)

        try {
          let connection = await voiceChannel.join()
          queueContruct.connection = connection
          play(
            message.guild,
            queueContruct.songs[0],
            this.client,
            message.author
          )
        } catch (err) {
          this.client.queueSongs.delete(message.guild.id)
          return message.channel.send(err)
        }
      } else {
        serverQueueSongs.songs.push(song)
        return message.channel.send(
          `${message.author}\n- **${song.title}** foi adicionado na fila!`
        )
      }
    } catch (error) {
      console.error(error)
      return message.util.reply(error.message).catch(console.error)
    }
  }

  youtube_parser_link(url: string): string | boolean {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    var match = url.match(regExp)
    return match && match[7].length == 11 ? match[7] : false
  }
}

export default Mp3Play
