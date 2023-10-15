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
      description: "get all appointment entries",
    },
    {
      name: "add",
      description: "add an appointment",
      options: [
        {
          name: "appointment",
          description: "Name of the Appointment",
          required: true,
          type: 3,
        },
        {
          name: "appointmentdate",
          description: "Date of the Appointment",
          required: true,
          type: 3,
        },
        {
          name: "appointmenttime",
          description: "Time of the Appointment",
          required: true,
          type: 3,
        },
      ],
    },
    {
      name: "del",
      description: "delete a specific appointment",
      options: [
        {
          name: "appointment",
          description: "Name of the Appointment",
          required: true,
          type: 3,
        },
        {
          name: "appointmentdate",
          description: "Date of the Appointment",
          required: true,
          type: 3,
        },
        {
          name: "appointmenttime",
          description: "Time of the Appointment",
          required: true,
          type: 3,
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
