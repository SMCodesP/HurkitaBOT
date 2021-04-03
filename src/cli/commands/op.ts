import { CommandCLI } from '../structures/entities/CommandCLI'
import { bot } from '../../index'
import { v4 as uuid } from 'uuid'
import * as db from 'quick.db'
import { UserBot } from '../../bot/structures/entities/UserBot'
import { bgWhite, black } from 'colors/safe'
import CLI from '..'
import { RoleBot } from '../../bot/structures/entities/RoleBot'

class CommandOp extends CommandCLI {
  constructor() {
    super('op', {
      name: 'op',
      description: {
        content: 'Comando para dar permissão global a um usuário.',
        usage: '[command] [userID]',
      },
    })
  }

  async exec(args: string[], _: CLI, commandUsage: string) {
    const userID = args[0]

    if (!userID)
      return console.cli(
        `Syntax incorreta, utilize o comando dessa forma: ${black(
          bgWhite(`${commandUsage} [userID]`)
        )}`
      )

    try {
      const user = await bot.users.fetch(userID)

      if (!user)
        return console.cli(
          'O usuário digitado é inválido, por favor digite um id válido.'
        )

      const userBot: UserBot = db.get(`users.${user.id}`)

      const role = this.createRoleGlobal()

      if (!userBot) {
        db.set(`users.${userID}`, {
          id: userID,
          roles: [role],
        })
      } else {
        if (userBot.roles.find((role) => role.name === 'masterBot'))
          return console.cli(`O usuário já tem cargo global.`)

        db.set(`users.${userID}.roles`, [...userBot.roles, role])
      }

      console.cli(
        `Você deu cargo global para o usuário ${black(bgWhite(args[0]))}`
      )
    } catch (error) {
      console.error(error)
      console.cli(
        'O usuário digitado é inválido, por favor digite um id válido.'
      )
    }
  }

  createRoleGlobal() {
    let role: RoleBot = db.get(`roles.masterBot`)
    if (!role) {
      role = {
        id: uuid(),
        name: 'masterBot',
        permissions: ['*'],
      }
    }

    return role
  }
}

export default CommandOp
