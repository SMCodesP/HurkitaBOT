import { CommandCLI } from "../structures/entities/CommandCLI";
import { bot } from "../../index";
import * as db from "quick.db";
import { UserBot } from "../../bot/structures/entities/UserBot";

class CommandOp extends CommandCLI {
    constructor() {
        super('op')
    }

    async exec(args) {

        const userID = args[0]

        if (!userID)
            return console.log(`Syntax incorreta, utilize o comando dessa forma: ${this.id} [userID]`)
        
        try {
            const user = await bot.users.fetch(userID)
    
            if (!user)
                return console.log('O usuário digitado é inválido, por favor digite um id válido.')
                
            const userBot: UserBot = db.get(`users.${user.id}`)
            
            
            if (!userBot) {
                db.set(`users.${user.id}`, {
                    id: user.id,
                    roles: ["*"],
                })
            } else {
                db.set(`users.${user.id}.roles`, [...userBot.roles, "*"])
            }
            
            console.log(`Você deu cargo global para o usuário ${args[0]}`)   
        } catch (error) {
            console.error(error)
            console.log('O usuário digitado é inválido, por favor digite um id válido.')
        }

    }
}

export default CommandOp