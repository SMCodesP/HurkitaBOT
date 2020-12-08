import * as db from "quick.db"
import { Listener } from "discord-akairo"

import { BotClientTypes } from "../index"

class RegisterCommandsOfSonicListener extends Listener {
    client: BotClientTypes;

    constructor() {
        super("ready", {
            emitter: "client",
            event: "ready"
        })
    }

    async exec() {
        const commands = this.client.commandHandler.modules
        
        commands.forEach((command, key) => {
            let text: string;

            if (command.description.type_log) {
                const types_log: string[] = db.get("types_log") || []

                if (!types_log.includes(command.description.type_log)) {
                    db.push("types_log", command.description.type_log)
                }
            }

            text += command.id
            text += " "
            text += command.aliases.join(" ")
            text += " "
            text += command.category.id
            text += " "
            text += command.description.metadata

            this.client.sonicChannelIngest.push(
                "commands_test",
                "default",
                key,
                text,
                {
                    lang: 'por'
                }
            )
        })
    }

}

export default RegisterCommandsOfSonicListener
