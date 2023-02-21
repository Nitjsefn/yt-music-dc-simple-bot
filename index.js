//Intents https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits
//Discord.js documentation https://discord.js.org/#/docs/discord.js/main/general/welcome
const {prefix, token} = require("./config.json");
const { Client, GatewayIntentBits } = require("discord.js");
const DCVoice = require("discord-voice");
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const { log } = console;
var BOT_NAME;


bot.login(token);
bot.once("ready", () => { log("Bot connected"); BOT_NAME = bot.user.username; });
bot.on("messageCreate", msg => messageCreateAndUpdateMethod(msg));
bot.on("messageUpdate", (old_msg, msg) => messageCreateAndUpdateMethod(msg));

function messageCreateAndUpdateMethod(msg)
{
    log("Message");
}