import { Message } from 'discord.js'
import { Command, Listener } from 'discord-akairo'

class AlertCooldownCommandListener extends Listener {
  constructor() {
    super('cooldown', {
      emitter: 'commandHandler',
      event: 'cooldown',
    })
  }

  exec(message: Message, _: Command, remaining: number) {
    message.channel.send(
      `⏰ ${
        message.author
      }\n**Cooldown**, você não pode executar comandos no momento.\n**Aguarde »** ${this.timeConversion(
        remaining
      )}`
    )
  }

  timeConversion(millisec: number) {
    var seconds = Number((millisec / 1000).toFixed(1))
    var minutes = Number((millisec / (1000 * 60)).toFixed(1))
    var hours = Number((millisec / (1000 * 60 * 60)).toFixed(1))
    var days = Number((millisec / (1000 * 60 * 60 * 24)).toFixed(1))

    if (seconds < 60) {
      return seconds + ' segundos'
    } else if (minutes < 60) {
      return minutes + ' minutos'
    } else if (hours < 24) {
      return hours + ' horas'
    } else {
      return days + ' dias'
    }
  }
}

export default AlertCooldownCommandListener
