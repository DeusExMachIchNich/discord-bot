import { Client, GatewayIntentBits, Routes } from "discord.js";
import { interactionHandler, readyHandler } from "./src/actions/index.js";
import { config } from "dotenv";
import { dbInit } from "./src/index.js";
import { REST } from "discord.js";

config();
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const db = dbInit();

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

client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    interactionHandler(interaction, db);
  }
});

(async () => {
  const commands = [
    {
      name: "help",
      description: "view commands",
    },
    {
      name: "get",
      description: "get all event entries",
    },
    {
      name: "add",
      description: "Add an event",
      options: [
        {
          name: "event",
          description: "Name of the event",
          required: true,
          type: 3,
        },
        {
          name: "date",
          description: "Date of the event",
          required: true,
          type: 3,
          max_length: 10,
          min_length: 10
        },
        {
          name: "time",
          description: "Time of the event",
          required: true,
          type: 3,
          max_length: 5,
          min_length: 5
        },
      ],
    },
    {
      name: "del",
      description: "delete a specific event",
      options: [
        {
          name: "event",
          description: "Name of the event",
          required: true,
          type: 3,
        },
        {
          name: "date",
          description: "Date of the event",
          required: true,
          type: 3,
          max_length: 10,
          min_length: 10
        },
        {
          name: "time",
          description: "Time of the event",
          required: true,
          type: 3,
          max_length: 5,
          min_length: 5
        },
      ],
    },
    {
      name: "command",
      description: "use a script",
      options: [
        {
          name: "script",
          description: "npm run xxx",
          required: true,
          type: 3,
          max_length: 20
        },
      ],
    },
  ];

  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("api ready");
  } catch (err) {
    console.log(err);
  }
})();

client.login(process.env.TOKEN);
