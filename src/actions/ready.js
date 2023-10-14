import { appointmentsGet, appointmentDelete } from "./index.js";
import { isCurrentDateTimeClose } from "../index.js";

export const readyHandler = (db, client) => {
  const appointmentData = {}; // Initialize an object to store appointment data
  const messageToUsers = process.env.messageToUsers;
  const shortTimer = parseInt(process.env.shortTimer) * 1000 * 60;
  const longTimer = parseInt(process.env.longTimer) * 1000 * 60;
  const interval = parseInt(process.env.interval) * 1000;

  setInterval(async () => {
    const data = await appointmentsGet(db, client);

    for (const key in appointmentData) {
      if (isCurrentDateTimeClose(key) < 0) {
        delete appointmentData[key];
      }
    }

    for (const appointment of data) {
      const timeDiff = isCurrentDateTimeClose(appointment.date);

      if (timeDiff < 0) {
        appointmentDelete(db, appointment);
        delete appointmentData[appointment.date];
      }

      const notifiedType = appointmentData[appointment.date]?.notified;
      const shouldNotifyLong =
        timeDiff < longTimer &&
        timeDiff > shortTimer &&
        notifiedType !== "long";
      const shouldNotifyShort =
        timeDiff < shortTimer && timeDiff > 0 && notifiedType !== "short";
      if (shouldNotifyLong || shouldNotifyShort) {
        client.channels.cache
          .find((channel) => channel.id === appointment.channelId)
          .send(
            `${messageToUsers}${appointment.appointment}, ${appointment.date}`
          );

        appointmentData[appointment.date] = {
          notified: shouldNotifyLong ? "long" : "short",
        };
        console.log(shouldNotifyLong ? "long timer" : "short timer");
      }
    }
  }, interval);
};
