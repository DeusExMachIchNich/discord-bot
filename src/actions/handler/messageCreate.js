import { addAppointment, appointmentDelete } from "../index.js";
import { exec } from "child_process";

export const messageCreateHandler = async (msg, db) => {
  const content = msg.content.trim();

  if (content === "!help") {
    msg.reply(`To create a new Appointment (don't type the Brackets):
    !add [AppointmentName] [DD/MM/YYYY] [HH:MM]
    !add [AppointmentName] [DD.MM.YYYY] [HH:MM]

    To delete an Appointment (don't type the Brackets):
    !del [AppointmentName] [DD/MM/YYYY] [HH:MM]
    !del [AppointmentName] [DD.MM.YYYY] [HH:MM]
    `);
  }

  const addDelRestartRegex = /^!(add|del|command)(?:\s|$)/;
  const match = content.match(addDelRestartRegex);

  if (match) {
    const [, command /*, dateStr, timeStr*/] = match;
    
    if (command === "add") {
      // Handle appointment creation
      addAppointment(db, msg);
    } else if (command === "del") {
      // Handle appointment deletion
      appointmentDelete(db, msg);
    }
    if (command === "command") {
      const msgArray = msg.content.split(" ");
      executeCommand(msgArray[1], msg);
    }
  }
};

async function executeCommand(internalCommand, msg) {
  if (internalCommand && msg.member.roles.cache.find(role => role.name === process.env.bossRole) ) {
    try {
      // Use pm2 to restart the current process
      const test = exec(`npm run ${internalCommand}`);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
    return;
  } 
  msg.reply('You aint got the Balls for that command!')
  return
}
