import { Command } from "discord-akairo"
import { CollectorFilter, Message } from "discord.js"
import axios from "axios";
import { MessageEmbed } from "discord.js";
import * as db from "quick.db"
import { BotClientTypes } from "../../index";

function getRandom(arr: string[], n: number) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

class NSFWWallpaperAnimeCommand extends Command {
	client: BotClientTypes

	constructor() {
		super('nwallpaperanime', {
			aliases: ['nwallpaperanime', 'nsfwwallpaperanime', 'nwa', 'nsfwwa', 'awnsfw'],
			category: "🔞 NSFW | nsfw",
			description: {
				content: "Com esse comando você pode gerar um wallpaper NSFW de acordo com sua pesquisa.",
				metadata: "Comando para gerar wallpaper; anime;",
				usage: "[command] [pesquisa]",
				examples: [
					"[command] attack on titan",
					"[command] kimetsu no yaiba",
				],
			},
			args: [
				{
					id: "query",
					type: "string",
          match: "content"
				}
			]
		})
	}

	async exec(message: Message, { query }: { query: string }) {
    try {
      const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX
      if (message.channel.type !== "text")
          throw new Error(`Você não pode executar um comando NSFW nesse canal, para um wallpaper SFW use \`${prefix}aw ${query}\``)
      if (!message.channel.nsfw)
          throw new Error(`O canal não é um NSFW então você não pode executar esse comando aqui, para um wallpaper SFW use \`${prefix}aw ${query}\`.`)

      const {data: response} = await axios.get<{
        data: {
          path: string
          favorites: number
          thumbs: {
            large: string
            original: string
            small: string
          }
        }[]
      }>(`https://wallhaven.cc/api/v1/search?apikey=${process.env.WHALLHAVEN_API_KEY}&categories=010&purity=001&q=${query}`)
      
      if (response.data.length === 0) {
        throw new Error("Nenhum wallpaper foi encontrado.")
      }

      console.log(response.data.sort((a, b) => b.favorites - a.favorites))
      const thumbs = response.data.sort((a, b) => b.favorites - a.favorites).map(r => r.path)

      console.log(thumbs)
      console.log(getRandom(thumbs, 2))

      let item = 0

      const sendWallPaper = async (page: number) => {
        const messageWallpaper = await message.util.reply(new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("🔖 Wallpaper encontrado")
          .setDescription(`Clique [aqui](${thumbs[page]}) para baixar o wallpaper.`)
          .setImage(thumbs[page])
          .setTimestamp()
          .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())
        );

        (thumbs[page - 1]) && await messageWallpaper.react("⬅️");
        (thumbs[page + 1]) && await messageWallpaper.react("➡️");

        const reactionsOptions = {
          "⬅️": page - 1,
          "➡️": page + 1
        }

        const filterReactions: CollectorFilter = (reaction, user) => Object.keys(reactionsOptions).includes(reaction.emoji.name) && user.id === message.author.id

        const reaction = await messageWallpaper.awaitReactions(filterReactions, {
          max: 1,
        })

        const newPage = reactionsOptions[reaction.first().emoji.name];

        if (newPage) {
          await messageWallpaper.reactions.removeAll()
          sendWallPaper(newPage)
        }
      }

      sendWallPaper(item)

    } catch (error) {
      await message.util.reply(new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("🔖 Wallpapers error")
        .setDescription(`\n${error.message}`)
        .setTimestamp()
        .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL()))
    }

	}
}

export default NSFWWallpaperAnimeCommand
