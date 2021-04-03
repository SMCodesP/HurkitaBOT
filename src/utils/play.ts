import * as ytdl from 'ytdl-core'
import { Guild, User } from 'discord.js'

import { BotClientTypes } from '../bot'
import { Song } from '../bot/structures/entities/Song'
import { MessageEmbed } from 'discord.js'

export default function play(
  guild: Guild,
  song: Song,
  client: BotClientTypes,
  user: User
) {
  const serverQueue = client.queueSongs.get(guild.id)
  if (!song) {
    serverQueue.voiceChannel.leave()
    client.queueSongs.delete(guild.id)
    return
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on('finish', () => {
      serverQueue.songs.shift()
      play(guild, serverQueue.songs[0], client, user)
    })
    .on('error', (error) => {
      console.error(error)
      serverQueue.textChannel.send(
        'Houve um erro ao tocar a música, então ela foi pulada.'
      )
      serverQueue.songs.shift()
      console.log(guild, serverQueue.songs[0], client, user)
      play(guild, serverQueue.songs[0], client, user)
    })

  dispatcher.setVolumeLogarithmic(serverQueue.defaultVolume / 10)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    minute: '2-digit',
    hour: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  }

  const { responseData: item } = serverQueue.songs[0]

  const datePublished = new Date(item.snippet.publishedAt)
  const embedSearch = new MessageEmbed()
    .setColor('RANDOM')
    .setTitle(`📻 Estou tocando.`)
    .addField(`🖊️ Título »`, `\`\`\`yaml\n${item.snippet.title}\`\`\``, false)
    .addField(
      `⏲️ Publicado »`,
      `\`\`\`yaml\n${new Intl.DateTimeFormat('pt-BR', options).format(
        datePublished
      )}\`\`\``,
      true
    )
    .addField(
      `📈 Publicado por »`,
      `\`\`\`diff\n- ${item.snippet.channelTitle}\`\`\``,
      true
    )
    .addField(
      `📰 Descrição »`,
      `\`\`\`yaml\n${item.snippet.description}\`\`\`\n \u200B`,
      false
    )
    .setThumbnail(item.snippet.thumbnails.high.url)
    .setTimestamp()
    .setFooter(
      `Copyright © 2020 - ${client.user.username}`,
      client.user.displayAvatarURL()
    )

  serverQueue.textChannel.send(embedSearch)
}
