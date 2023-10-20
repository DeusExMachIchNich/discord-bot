import { getAppointments } from "../actions/index.js";

export const duplicateCheck = async (dataToCheck, db) => {
  const appointments = await getAppointments(db);

  return appointments.some((appointment) => {
    return (
      appointment.userId === dataToCheck.userId &&
      appointment.appointment === dataToCheck.appointment &&
      appointment.date === dataToCheck.date &&
      appointment.channelId === dataToCheck.channelId
    );
  });
};
