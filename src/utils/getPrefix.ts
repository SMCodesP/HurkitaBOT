import * as db from 'quick.db'

export default (guildID: string) => {
    return db.get(`${guildID}.prefix`) || process.env.PREFIX
}