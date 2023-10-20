import { duplicateCheck } from "../helpers/duplicateCheck.js";
import { isCurrentDateTimeClose } from "../index.js";
import { interactionMapper } from "../mapper/interactionMapper.js";

export const getAppointments = async (db) => {
  return await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${process.env.tableName}`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const deleteAppointment = async (db, data) => {
  const appointment = interactionMapper(data);
  const query = `
  DELETE FROM ${process.env.tableName}
  WHERE appointment = ? AND date = ? AND channelId = ?
`;
  return new Promise((resolve, reject) => {
    db.run(
      query,
      [appointment.appointment, appointment.date, appointment.channelId],
      function (err) {
        if (err) {
          reject(err);
        } else if (this.changes > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

export const addAppointment = async (db, interaction) => {
  const mappedInteraction = interactionMapper(interaction);

  if(await duplicateCheck(mappedInteraction, db)){
    return interaction.reply("already exists my bruh")
  }
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
  }
  interaction.reply("Failed to create, check your format");
};
