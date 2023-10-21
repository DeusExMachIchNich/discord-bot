import { getEvents } from "../actions/index.js";

export const duplicateCheck = async (dataToCheck, db) => {
  const events = await getEvents(db);

  return events.find((event) => {
    return (
      event.userId === dataToCheck.userId &&
      event.event === dataToCheck.event &&
      event.date === dataToCheck.date &&
      event.channelId === dataToCheck.channelId
    );
  });
};
