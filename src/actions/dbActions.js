import { isCurrentDateTimeClose } from "../index.js";
import { interactionMapper } from "../mapper/interactionMapper.js";

export const getAppointments = (db) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${process.env.tableName}`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const deleteAppointment = (db, data) => {
  const appointment = interactionMapper(data);

  const query = `
    DELETE FROM ${process.env.tableName}
    WHERE appointment = ? AND date = ? AND channelId = ?
  `;

  db.run(query, [appointment.appointment, appointment.date, appointment.channelId], (err) => {
    if (err) {
      console.error("Error deleting record:", err.message);
      throw err; // Throw the error to be handled externally
    } else {
      console.log("Record deleted successfully: " + appointment.appointment);
    }
  });
};

export const addAppointment = (db, interaction) => {
  const mappedInteraction = interactionMapper(interaction);
  const dateTimeRegex = /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/;

  const stmt = db.prepare(`INSERT INTO ${process.env.tableName} VALUES (?, ?, ?, ?)`);

  if (isCurrentDateTimeClose(mappedInteraction.date) < 0) {
    throw new Error(process.env.AppointmentInThePastMsg);
  }

  if (dateTimeRegex.test(mappedInteraction.date)) {
    stmt.run(
      interaction.user.id,
      mappedInteraction.appointment,
      mappedInteraction.date,
      mappedInteraction.channelId,
      (err) => {
        if (err) {
          console.error(err);
          throw err;
        } else {
          console.log("New appointment added successfully");
        }
      }
    );
    stmt.finalize();
  } else {
    throw new Error("Failed to create, check your format");
  }
};
