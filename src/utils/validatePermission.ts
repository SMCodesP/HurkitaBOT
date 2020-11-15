import { User } from "discord.js";
import * as db from "quick.db";
import { UserBot } from "../bot/structures/entities/UserBot";

export default (user: User, permission: string): boolean => {
    
    const userBot: UserBot = db.get(`users.${user.id}`)

    if (!userBot)
        return (process.env.OWNER_ID === user.id)   

    return (process.env.OWNER_ID === user.id || userBot.roles.find((element) => element.permissions.includes("*") || element.permissions.includes(permission))) !== undefined

}