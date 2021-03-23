import { Command } from "discord-akairo"
import { CollectorFilter, Message, MessageAttachment } from "discord.js"
import axios from "axios";
import { BotClientTypes } from "../../index";
import { MessageEmbed } from "discord.js";

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

class WallpaperAnimeCommand extends Command {
	client: BotClientTypes

	constructor() {
		super('wallpaperanime', {
			aliases: ['wallpaperanime', 'wallpapera', 'animewallpaper', 'awallpaper', 'aw'],
			category: "🦊 Animes | animes",
			description: {
				content: "Com esse comando você pode gerar um wallpaper de acordo com seu pedido.",
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
      }>(`https://wallhaven.cc/api/v1/search?categories=anime&sorting=favorites&q=${query}`)
      
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

export default WallpaperAnimeCommand
