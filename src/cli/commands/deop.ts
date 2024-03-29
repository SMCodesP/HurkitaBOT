import { CommandCLI } from '../structures/entities/CommandCLI'
import { bot } from '../../index'
import { v4 as uuid } from 'uuid'
import * as db from 'quick.db'
import { UserBot } from '../../bot/structures/entities/UserBot'
import { bgWhite, black } from 'colors/safe'
import CLI from '..'
import { RoleBot } from '../../bot/structures/entities/RoleBot'

class CommandDeOp extends CommandCLI {
  constructor() {
    super('deop', {
      name: 'deop',
      description: {
        content: 'Comando para retirar a permissão global de um usuário.',
        usage: '[command] [userID]',
      },
    })
  }

  async exec(args: string[], _: CLI, commandUsage: string) {
    const userID = args[0]

    if (!userID)
      return console.log(
        `Syntax incorreta, utilize o comando dessa forma: ${black(
          bgWhite(`${commandUsage} [userID]`)
        )}`
      )

    try {
      const user = await bot.users.fetch(userID)

      if (!user)
        return console.log(
          'O usuário digitado é inválido, por favor digite um id válido.'
        )

      const userBot: UserBot = db.get(`users.${user.id}`)

      if (
        !userBot ||
        !userBot.roles.find((role) => role.name === 'masterBot')
      ) {
        return console.log('O usuário não tem cargo global.')
      }

      db.set(
        `users.${userID}.roles`,
        userBot.roles.filter((role) => role.name !== 'masterBot')
      )

      console.log(
        `Você retirou o cargo global do usuário ${black(bgWhite(args[0]))}`
      )
    } catch (error) {
      console.error(error)
      console.log(
        'O usuário digitado é inválido, por favor digite um id válido.'
      )
    }
  }
}

export default CommandDeOp
