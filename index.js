import dotenv from "dotenv";
import { dbInit } from "./src/index.js";
import { Client, GatewayIntentBits } from "discord.js";
import { messageCreateHandler, readyHandler } from "./src/actions/index.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const db = dbInit();

client.on("ready", () => {
  
  readyHandler(db, client);
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  messageCreateHandler(msg, db);
});

client.login(process.env.TOKEN);
