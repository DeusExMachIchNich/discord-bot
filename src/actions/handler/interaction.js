import {
  addAppointment,
  deleteAppointment,
  getAppointments
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
    const data = await getAppointments(db);
    let output = `Eventlist:`

    if (Object.keys(data).length > 0) {
      data.forEach((element) => {
        output += `\n ${element.appointment} ${element.date} `;
      });

      interaction.reply(output);
      return;
    }
    interaction.reply("no entry found");

  }

  if (command === "add") {
    addAppointment(db, interaction);
  }

  if (command === "del") {
    const res = await deleteAppointment(db, interaction);
    if(res){
      interaction.reply("deleted")
      return
    }
    interaction.reply("nah mate aint got deleted")
    return
  }

  if (command === "command") {
    executeCommand(interaction);
  }
};

async function executeCommand(interaction) {
  if (
    interaction.member.roles.cache.find(
      (role) => role.name === process.env.bossRole
    )
  ) {
    try {
      // Use pm2 for some npm run commands.
      interaction.reply(
        `you want me to do dirty stuff like ${
          interaction.options.get("script").value
        }?!`
      );
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
