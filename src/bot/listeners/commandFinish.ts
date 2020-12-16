import { Message } from 'discord.js';
import { Command, Listener } from "discord-akairo";
import { blue, red,  } from 'colors/safe';

class CommandFinishListener extends Listener {

    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            event: 'commandFinished'
        });
    }

    exec(message: Message, command: Command) {
        console.log(message.member.roles.highest.hexColor)

        console.log(`${blue(message.author!.tag)} executou o comando ${red(command.id)}.`);
    }
}

export default CommandFinishListener
