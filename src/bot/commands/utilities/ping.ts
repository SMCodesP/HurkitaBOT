import { Command } from 'discord-akairo'
import { GuildMember } from 'discord.js'
import { Message } from 'discord.js'
import { BotClientTypes } from '../../index'

class PingCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: '🛠️ Utilitários | utils',
      description: {
        content:
          'Com esse comando você pode ver a minha estabilidade diante o meu servidor e o discord.',
        metadata: 'Comando para ping estabilidade',
        usage: '[command]',
        examples: ['[command]'],
      },
    })
  }

  async exec(message: Message) {
    message.util.reply(
      `aqui está minhas informações sobre tempo de resposta.\n📶 - **API ping »** \`${
        this.client.ws.ping
      }ms\`\n⌚ - **Latência »** \`${Date.now() - message.createdTimestamp}ms\``
    )
  }
}

export default PingCommand
