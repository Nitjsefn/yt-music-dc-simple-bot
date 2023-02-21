//Intents https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits
//Discord.js documentation https://discord.js.org/#/docs/discord.js/main/general/welcome
const {prefix, token} = require("./config.json");
const { Client, GatewayIntentBits } = require("discord.js");
const DCVoice = require("discord-voice");
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] });
const { log } = console;
var BOT_NAME;


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
        case "pause": pauseCommand(msg); break;
        case "stop": stopCommand(msg); break;
		case "resume": resumeCommand(msg); break;
        default: msg.reply("Wrong command!"); break;
    }
}