//Intents https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits
//Discord.js documentation https://discord.js.org/#/docs/discord.js/main/general/welcome
const {prefix, token} = require("./config.json");
const { Client, GatewayIntentBits } = require("discord.js");
const DCVoice = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const { execSync } = require("child_process");
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] });
const { log } = console;
var BOT_NAME;
var playersInGuilds = new Map();

bot.login(token);
bot.once("ready", () => { log("Bot connected"); BOT_NAME = bot.user.username; });
bot.on("messageCreate", msg => messageCreateAndUpdateMethod(msg));
bot.on("messageUpdate", (old_msg, msg) => messageCreateAndUpdateMethod(msg));

function messageCreateAndUpdateMethod(msg)
{
    if(msg.author.isBot) return;
	if(msg.content[0] != prefix) return;
	let arguments = msg.content.split(' ');
	arguments[0] = arguments[0].slice(1);
	let command = arguments.shift();
	switch(command)
	{
		case "play": playCommand(msg, arguments); break;
        case "playlist": playListCommand(msg, arguments); break;
        case "skip": skipCommand(msg); break;
        case "pause": pauseCommand(msg); break;
        case "stop": stopCommand(msg); break;
		case "resume": resumeCommand(msg); break;
        default: msg.reply("Wrong command!"); break;
    }
}

async function playCommand(msg, args)
{
	if(!msg.member.voice.channelId) { msg.reply("You are not in voice channel"); return; }
	if(!msg.member.voice.channel.joinable) { msg.reply("I can't join to your voice channel"); return; }
	if(args.length == 0) { msg.reply("You didn't write the title of song"); return; }
	let query = '';
	for(let i = 0; i < args.length; i++) query += `${args[i]} `;
	let songInfo = await ytdl.getInfo(query);
    if(!songInfo.videoDetails.video_url)
    {
        msg.reply("Unable to find song!");
        return;
    }
    let player = playersInGuilds.get(msg.guildId);
    if(player)
    {
        player.queue.push({ songTitle: songInfo.videoDetails.title, songUrl: songInfo.videoDetails.video_url });
    }
    else
    {
        player = {connection: null, audioPlayer: null, queue: Array(), repeat: 0};
        player.queue.push({ songTitle: songInfo.videoDetails.title, songUrl: songInfo.videoDetails.video_url });
        player.connection = DCVoice.joinVoiceChannel({channelId: msg.member.voice.channelId, guildId: msg.guildId, adapterCreator: msg.channel.guild.voiceAdapterCreator});
        player.connection.on(DCVoice.VoiceConnectionStatus.Disconnected, (oldState, newState) =>
		{
			if(playersInGuilds.has(msg.guildId)) playersInGuilds.delete(msg.guildId);
			let conn = DCVoice.getVoiceConnection(msg.guildId);
			if(!conn) { msg.reply("I am not in the voice channel!"); return; }
			conn.destroy();
		});
        player.audioPlayer = DCVoice.createAudioPlayer({ behaviors: { noSubscriber: DCVoice.NoSubscriberBehavior.Pause } });
        player.audioPlayer.addListener("stateChange", (oldOne, newOne) =>
		{
			if (newOne.status == "idle")
			{
				if(!playersInGuilds.has(msg.guildId)) { msg.reply("I am not playing anything!"); return; }
                let player = playersInGuilds.get(msg.guildId);
                if(player.repeat == 0) //None repeat
                {
                    player.queue.shift();
                    if(player.queue.length == 0)
                    {
                        player.audioPlayer.stop();
                        player.connection.destroy();
                        playersInGuilds.delete(msg.guildId);
                        msg.reply("Nothing to play anymore");
                        return;
                    }
                }
                else if(player.repeat == 2) //Repeat all
                {
                    player.queue.push(player.queue.shift());
                }
                let rsc = DCVoice.createAudioResource(ytdl(player.queue[0].songUrl, { filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25 }));
                player.audioPlayer.play(rsc);
                msg.reply(`Now playing:\n***${player.queue[0].songTitle}***`);
			}
		});
        player.connection.subscribe(player.audioPlayer);
        let rsc = DCVoice.createAudioResource(ytdl(player.queue[0].songUrl, { filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25 }));
        player.audioPlayer.play(rsc);
        msg.reply(`Now playing:\n***${player.queue[0].songTitle}***`);
    }
    playersInGuilds.set(msg.guildId, player);
}

async function playListCommand(msg, args)
{
	if(!msg.member.voice.channelId) { msg.reply("You are not in voice channel"); return; }
	if(!msg.member.voice.channel.joinable) { msg.reply("I can't join to your voice channel"); return; }
	if(args.length == 0) { msg.reply("You didn't write the title of song"); return; }
	let query = '';
	for(let i = 0; i < args.length; i++) query += `${args[i]} `;
    let songsIds;
    try
    {
        songsIds = execSync(`.\\ytdlp\\yt-dlp.exe -i --no-abort-on-error --print \"%(id)s\" ${query}`, { stdio: "pipe" }).toString().split('\n');
    }
    catch(e)
    {
        songsIds = e.stdout.toString().split('\n');
    }
	let songInfo = await ytdl.getInfo(songsIds.shift());
    if(!songInfo.videoDetails.video_url)
    {
        msg.reply("Unable to find song!");
        return;
    }
    let player = playersInGuilds.get(msg.guildId);
    if(player)
    {
        player.queue.push({ songTitle: songInfo.videoDetails.title, songUrl: songInfo.videoDetails.video_url });
    }
    else
    {
        player = {connection: null, audioPlayer: null, queue: Array(), repeat: 0};
        player.queue.push({ songTitle: songInfo.videoDetails.title, songUrl: songInfo.videoDetails.video_url });
        player.connection = DCVoice.joinVoiceChannel({channelId: msg.member.voice.channelId, guildId: msg.guildId, adapterCreator: msg.channel.guild.voiceAdapterCreator});
        player.connection.on(DCVoice.VoiceConnectionStatus.Disconnected, (oldState, newState) =>
		{
			if(playersInGuilds.has(msg.guildId)) playersInGuilds.delete(msg.guildId);
			let conn = DCVoice.getVoiceConnection(msg.guildId);
			if(!conn) { msg.reply("I am not in the voice channel!"); return; }
			conn.destroy();
		});
        player.audioPlayer = DCVoice.createAudioPlayer({ behaviors: { noSubscriber: DCVoice.NoSubscriberBehavior.Pause } });
        player.audioPlayer.addListener("stateChange", (oldOne, newOne) =>
		{
			if (newOne.status == "idle")
			{
				if(!playersInGuilds.has(msg.guildId)) { msg.reply("I am not playing anything!"); return; }
                let player = playersInGuilds.get(msg.guildId);
                if(player.repeat == 0) //None repeat
                {
                    player.queue.shift();
                    if(player.queue.length == 0)
                    {
                        player.audioPlayer.stop();
                        player.connection.destroy();
                        playersInGuilds.delete(msg.guildId);
                        msg.reply("Nothing to play anymore");
                        return;
                    }
                }
                else if(player.repeat == 2) //Repeat all
                {
                    player.queue.push(player.queue.shift());
                }
                let rsc = DCVoice.createAudioResource(ytdl(player.queue[0].songUrl, { filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25 }));
                player.audioPlayer.play(rsc);
                msg.reply(`Now playing:\n***${player.queue[0].songTitle}***`);
			}
		});
        player.connection.subscribe(player.audioPlayer);
        let rsc = DCVoice.createAudioResource(ytdl(player.queue[0].songUrl, { filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25 }));
        player.audioPlayer.play(rsc);
        msg.reply(`Now playing:\n***${player.queue[0].songTitle}***`);
    }
    for (let i = 0; i < songsIds.length; i++)
    {
        if(!songsIds[i]) continue;
        songInfo = await ytdl.getInfo(songsIds[i]);
        if(!songInfo) continue;
        player.queue.push({ songTitle: songInfo.videoDetails.title, songUrl: songInfo.videoDetails.video_url });
    }
    playersInGuilds.set(msg.guildId, player);
}

function skipCommand(msg)
{
    let player = playersInGuilds.get(msg.guildId);
    if(!player)
    {
        msg.reply("I am not playing anything!");
        return;
    }
    player.audioPlayer.stop();
    player.queue.shift();
    if(player.queue.length == 0)
    {
        msg.reply("That was the last song in the queue");
        player.connection.destroy();
        playersInGuilds.delete(msg.guildId);
        return;
    }
    let rsc = DCVoice.createAudioResource(ytdl(player.queue[0].songUrl, { filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25 }));
    player.audioPlayer.play(rsc);
    msg.reply(`Now playing:\n***${player.queue[0].songTitle}***`);
}

function pauseCommand(msg)
{
    let player = playersInGuilds.get(msg.guildId);
    if(!player)
    {
        msg.reply("I am not playing anything!");
        return;
    }
    player.audioPlayer.pause(true);
}

function resumeCommand(msg)
{
    let player = playersInGuilds.get(msg.guildId);
    if(!player)
    {
        msg.reply("I am not playing anything!");
        return;
    }
    player.audioPlayer.unpause();
}