import { Message } from 'discord.js'
import { Command, Listener } from 'discord-akairo'
import { red, gray } from 'colors/safe'
import * as randomColor from 'randomcolor'
import { hex } from 'chalk'
import * as db from 'quick.db'

class CommandFinishListener extends Listener {
  constructor() {
    super('commandFinished', {
      emitter: 'commandHandler',
      event: 'commandFinished',
    })
  }

  exec(message: Message, command: Command, args: { text: any | any[] }) {
    const { text = '' } = args

    const textArray = text.split(' ')
    const colorHex = message.member.roles.highest.hexColor
    const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX
    const arrayArguments = textArray
      .filter((textArgument) => String(textArgument).trim().length !== 0)
      .map((textArgument) =>
        typeof textArgument === 'string'
          ? `"${textArgument.trim()}"`
          : textArgument.trim()
      )
  }
}

export default CommandFinishListener
