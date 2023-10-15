import { getAppointments, deleteAppointment } from "./index.js";
import { isCurrentDateTimeClose } from "../index.js";
import { embedTemplate } from "../embedTemplate.js";

export const readyHandler = (db, client) => {
  const appointmentData = {}; // Initialize an object to store appointment data
  const shortTimer = parseInt(process.env.shortTimer) * 1000 * 60;
  const longTimer = parseInt(process.env.longTimer) * 1000 * 60;
  const interval = parseInt(process.env.interval) * 1000;

  setInterval(async () => {
    const data = await getAppointments(db, client);

    for (const key in appointmentData) {
      //check if anything is in the past & removes it from local appointmentData
      if (isCurrentDateTimeClose(key) < 0) {
        delete appointmentData[key];
      }
    }
    for (const appointment of data) {
      const timeDiff = isCurrentDateTimeClose(appointment.date);
      const notifiedType = appointmentData[appointment.date]?.notified;
      const shouldNotifyShort =
        timeDiff < shortTimer && timeDiff > 0 && notifiedType !== "short";
      const shouldNotifyLong =
        timeDiff < longTimer &&
        timeDiff > shortTimer &&
        notifiedType !== "long";

      if (timeDiff < 0) {
        deleteAppointment(db, appointment);
        delete appointmentData[appointment.date];
      }

      if (shouldNotifyLong || shouldNotifyShort) {
        if (process.env.mode === "1") { //decide for plain message or embed Message
          const embed = await embedTemplate(appointment, client);
          client.channels.cache
            .find((channel) => channel.id === appointment.channelId)
            .send({
              embeds: [embed],
            });
        } else {
          client.channels.cache
            .find((channel) => channel.id === appointment.channelId)
            .send(
              `${process.env.messageToUsers} ${appointment.appointment}, ${appointment.date}`
            );
        }

        appointmentData[appointment.date] = {
          notified: shouldNotifyLong ? "long" : "short",
        };
        console.log(shouldNotifyLong ? "long timer" : "short timer");
      }
    }
  }, interval);
};
