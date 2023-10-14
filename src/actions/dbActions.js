import { isCurrentDateTimeClose } from "../index.js";
import { interactionMapper } from "../mapper/interactionMapper.js";

export const appointmentsGet = async (db) => {
  try {
    return await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${process.env.tableName}`, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  } catch (err_1) {
    console.error(err_1);
  }
};

export const appointmentDelete = (db, data) => {
  const appointment = interactionMapper(data);

  const query = `
  DELETE FROM ${process.env.tableName}
  WHERE appointment = ? AND date = ? AND channelId = ?
`;
  try {
    db.all(
      query,
      [appointment.appointment, appointment.date, appointment.channelId],
      (err) => {
        if (err) {
          console.error("Error deleting record:", err.message);
        } else {
          console.log("Record deleted successfully." + appointment.appointment);
        }
      }
    );
  } catch (err_1) {
    console.error(err_1);
  }
};

export const addAppointment = async (db, interaction) => {
  const mappedInteraction = interactionMapper(interaction);
  const dateTimeRegex =
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (\d{2}:\d{2})$/;
  const DEdateTimeRegex =
    /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4} (\d{2}:\d{2})$/;

  const stmt = db.prepare(
    `INSERT INTO ${process.env.tableName} VALUES (?, ?, ?, ?)`
  );

  if (isCurrentDateTimeClose(mappedInteraction.date) < 0) {
    return interaction.reply(process.env.AppointmentInThePastMsg);
  }

  if (
    dateTimeRegex.test(mappedInteraction.date) ||
    DEdateTimeRegex.test(mappedInteraction.date)
  ) {
    stmt.run(
      interaction.user.id,
      mappedInteraction.appointment,
      mappedInteraction.date,
      mappedInteraction.channelId
    );
    await stmt.finalize();
    interaction.reply(process.env.newAppointmentMsg);
    return;
  } else {
  }
};

export const getAllAppointments = async (db, interaction) => {
  db.all(`SELECT * FROM ${process.env.tableName}`, (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    if (Object.keys(rows).length > 0) {
      rows.forEach((element) => {
        interaction.reply(`${element.appointment} ${element.date}`);
      });
      return;
    }
    interaction.reply("no entry found");
  });

  return;
};
