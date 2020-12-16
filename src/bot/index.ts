import { resolve } from "path"
import { gray, green, red } from "colors/safe";
import * as db from 'quick.db'
import { AkairoClient, CommandHandler, CommandHandlerOptions, ListenerHandler, InhibitorHandler, SQLiteProvider } from "discord-akairo"
import { Message, Intents } from "discord.js"
import { Ingest as SonicChannelIngest, Search as SonicChannelSearch } from "sonic-channel";
import { google, youtube_v3 } from "googleapis";

import { QueueItem } from "./structures/entities/QueueItem";

interface BotClientTypes extends AkairoClient {
	commandHandler: CommandHandler;
	registerCommandHandler(options: CommandHandlerOptions): void;
	init(token: string): Promise<void>;
	sonicChannelSearch: SonicChannelSearch;
	sonicChannelIngest: SonicChannelIngest;
	listenerHandler: ListenerHandler;
	intents: Intents;
	inhibitorHandler: InhibitorHandler;
	queueSongs: Map<string, QueueItem>;
	youtube: youtube_v3.Youtube;
}

class BotClient extends AkairoClient implements BotClientTypes {
	commandHandler: CommandHandler;
	settings: SQLiteProvider;
	sonicChannelSearch: SonicChannelSearch;
	sonicChannelIngest: SonicChannelIngest;
	listenerHandler: ListenerHandler;
	intents: Intents;
	inhibitorHandler: InhibitorHandler;
	queueSongs: Map<string, QueueItem>;
	youtube: youtube_v3.Youtube;
	
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

		this.youtube = google.youtube({
			version: "v3",
			auth: process.env.YOUTUBE_KEY_API
		})
		this.queueSongs = new Map();
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
			defaultCooldown: Number(process.env.DEFAULT_COOLDOWN) * 1000,
			blockBots: true,
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

        this.inhibitorHandler = new InhibitorHandler(this, {
			directory: resolve(__dirname, 'inhibitors')
		});
		this.listenerHandler = new ListenerHandler(this, {
			directory: resolve(__dirname, "listeners"),
		});

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
		})

		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
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
		try {
			await super.login(token)
			console.log(`${green("[Sucesso]")} O bot foi iniciado!`)
			return token
		} catch (err) {
			console.log(`${red("[Error]")} Houve um erro ao iniciar o bot.`)
			console.log(err)
			return err
		}
	}
}

export default BotClient
export type { BotClientTypes }
