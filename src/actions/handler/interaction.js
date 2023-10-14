import {
  addAppointment,
  appointmentDelete,
  getAllAppointments,
} from "../index.js";
import { exec } from "child_process";

export const interactionHandler = async (interaction, db) => {
  const command = interaction.commandName;

  if (command === "help") {
    interaction.reply(`To create a new Appointment (don't type the Brackets):
    /add [AppointmentName] [DD/MM/YYYY] [HH:MM]
    /add [AppointmentName] [DD.MM.YYYY] [HH:MM]

    To delete an Appointment (don't type the Brackets):
    /del [AppointmentName] [DD/MM/YYYY] [HH:MM]
    /del [AppointmentName] [DD.MM.YYYY] [HH:MM]
    `);
  }

  if (command === "get") {
    getAllAppointments(db, interaction);
  }

  if (command === "add") {
    addAppointment(db, interaction);
  }

  if (command === "del") {
    appointmentDelete(db, interaction);
  }

  if (command === "command") {
    executeCommand(interaction);
  }
};

async function executeCommand(interaction) {
  if ( interaction.member.roles.cache.find((role) => role.name === process.env.bossRole)) {
    try {
      // Use pm2 for some npm run commands.
      interaction.reply(`you want me to do dirty stuff like ${interaction.options.get("script").value}?!`)
      exec(`npm run ${interaction.options.get("script").value}`);
    } catch (error) {
      interaction.reply("Something unexpected happend");
      console.error(`Error: ${error}`);
    }
    return;
  }
  interaction.reply("You aint got the Balls for that command!");
  return;
}
