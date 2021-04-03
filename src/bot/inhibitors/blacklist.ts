import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'
import * as db from 'quick.db'

class BlacklistInhibitor extends Inhibitor {
  constructor() {
    super('blacklist', {
      reason: 'blacklist',
    })
  }

  exec(message: Message) {
    const userBanned = db.get(`banned.${message.author.id}`)

    if (!userBanned) {
      return false
    } else {
      message.util.reply(
        `você foi banido do meu sistema, ou seja você não pode executar meus comandos.`
      )
      return true
    }
  }
}

export default BlacklistInhibitor
