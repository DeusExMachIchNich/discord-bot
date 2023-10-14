import { config } from "dotenv";
import { dbInit } from "./src/index.js";
import { Client, GatewayIntentBits } from "discord.js";
import { messageCreateHandler, readyHandler } from "./src/actions/index.js";
import { REST } from "discord.js";

config();
const db = dbInit();
const rest = new REST({version:10}).setToken(process.env.TOKEN)


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


client.on("ready", () => {
  
  readyHandler(db, client);
  console.log(`${client.user.tag} just arrived!`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  messageCreateHandler(msg, db);
});

client.login(process.env.TOKEN);
