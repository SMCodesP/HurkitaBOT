import * as ytdl from "ytdl-core";
import { Guild, User } from "discord.js";

import { BotClientTypes } from "../bot";
import { Song } from "../bot/structures/entities/Song";

export default function play(guild: Guild, song: Song, client: BotClientTypes, user: User) {
    const serverQueue = client.queueSongs.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        client.queueSongs.delete(guild.id);
        return;
    }

    console.log(song)

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("start", () => {
            serverQueue.textChannel.send(`📻 ${user}\nEstou tocando agora » **${song.title}**`);
        })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], client, user);
        })
        .on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}