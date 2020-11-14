import { resolve } from "path"
import { gray, green, red } from "colors/safe";
import * as db from 'quick.db'
import { AkairoClient, CommandHandler, CommandHandlerOptions, ListenerHandler, SQLiteProvider } from "discord-akairo"
import { Message, Intents } from "discord.js"
import { Ingest as SonicChannelIngest, Search as SonicChannelSearch } from "sonic-channel";

interface BotClientTypes extends AkairoClient {
	commandHandler: CommandHandler;
	registerCommandHandler(options: CommandHandlerOptions): void;
	init(token: string): Promise<void>;
	sonicChannelSearch: SonicChannelSearch;
	sonicChannelIngest: SonicChannelIngest;
	listenerHandler: ListenerHandler;
	intents: Intents;
}

class BotClient extends AkairoClient implements BotClientTypes {
	commandHandler: CommandHandler;
	settings: SQLiteProvider;
	sonicChannelSearch: SonicChannelSearch;
	sonicChannelIngest: SonicChannelIngest;
	listenerHandler: ListenerHandler;
	intents: Intents;
	
	constructor() {
		let intentsLocal: Intents = new Intents([
			Intents.NON_PRIVILEGED,
			"GUILD_MEMBERS"
		])

		super({
			ownerID: process.env.OWNER_ID,
		}, {
			disableMentions: "everyone",
			ws: {
				intents: intentsLocal
			}
		});

		this.intents = intentsLocal
		
		this.startIngestSonic()
		this.startSearchSonic()

		this.registerCommandHandler({
			prefix: (message) => {
				if (message.guild)
					return db.get(`${message.guild.id}.prefix`) || process.env.PREFIX

				return process.env.PREFIX
			},
			directory: resolve(__dirname, "commands"),
			defaultCooldown: 15000,
			argumentDefaults: {
				prompt: {
					modifyStart: (_: Message, text: string): string => `${text}\n\nDigite \`cancelar\` para cancelar a sessão do comando.`,
					modifyRetry: (_: Message, text: string): string => `${text}\n\nDigite \`cancelar\` para cancelar a sessão do comando.`,
					timeout: "Você demorou muito para digitar, a sessão do comando foi cancelada",
					ended: "Você antingiu o máximo de tentativas na sessão com comando, então ela foi cancelada.",
					cancel: "A sessão do comando foi cancelada.",
					cancelWord: "cancelar",
					retries: 3,
					time: 3e4
				}
			},
			commandUtil: true,
			ignorePermissions: process.env.OWNER_ID,
			ignoreCooldown: process.env.OWNER_ID,
		})

		this.listenerHandler = new ListenerHandler(this, {
			directory: resolve(__dirname, "listeners"),
		});
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
		})
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.loadAll();
	}

	startSearchSonic() {
		this.sonicChannelSearch = new SonicChannelSearch({
			host: process.env.SONIC_HOST,
			port: Number(process.env.SONIC_PORT),
			auth: process.env.SONIC_PASSWORD
		})
			.connect({
				connected: () => {
					console.log(`${green('[Sucesso]')} O bot se conectou com o sonic search!`);
				},
				disconnected: () => {
					console.log(`${gray('[Info]')} O bot se desconectou do sonic search!`);
				},
			})
	}

	startIngestSonic() {
		this.sonicChannelIngest = new SonicChannelIngest({
			host: process.env.SONIC_HOST,
			port: Number(process.env.SONIC_PORT),
			auth: process.env.SONIC_PASSWORD
		}).connect({
			connected: () => {
				console.log(`${green('[Sucesso]')} O bot se conectou com o sonic ingest!`);
			},
			disconnected: () => {
				console.log(`${gray('[Info]')} O bot se desconectou do sonic ingest!`);
			},
		})
	}

	registerCommandHandler(options: CommandHandlerOptions) {
		this.commandHandler = new CommandHandler(this, options)
		this.commandHandler.loadAll()
	}

	async init(token: string) {
		return super.login(token)
			.then(() => {
				console.log(`${green("[Sucesso]")} O bot foi iniciado!`)
			}).catch((err) => {
				console.log(`${red("[Error]")} Houve um erro ao iniciar o bot.`)
				console.log(err)
			})
	}
}

export default BotClient
export type { BotClientTypes }
