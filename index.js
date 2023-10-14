import { config } from "dotenv";
import { dbInit } from "./src/index.js";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import { interactionHandler, readyHandler } from "./src/actions/index.js";
import { REST } from "discord.js";

config();
const db = dbInit();
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

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
    {
      name: "get",
      description: "get all appointment entries",
    },
  ];

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );
    console.log("api ready");
  } catch (err) {
    console.log(err);
  }
})();

client.login(process.env.TOKEN);
