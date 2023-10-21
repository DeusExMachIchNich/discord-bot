import { getEvents, deleteEvent } from "./index.js";
import { isCurrentDateTimeClose } from "../index.js";
import { embedTemplate } from "../embedTemplate.js";

export const readyHandler = (db, client) => {
  const event = {}; // Initialize an object to store event data
  const shortTimer = parseInt(process.env.shortTimer) * 1000 * 60;
  const longTimer = parseInt(process.env.longTimer) * 1000 * 60;
  const interval = parseInt(process.env.interval) * 1000;

  setInterval(async () => {
    const data = await getEvents(db, client);

    for (const key in event) {
      //check if anything is in the past & removes it from local event
      if (isCurrentDateTimeClose(key) < 0) {
        delete event[key];
      }
    }
    for (const eventItem of data) {
      const timeDiff = isCurrentDateTimeClose(eventItem.date);
      const notifiedType = event[eventItem.date]?.notified;
      const shouldNotifyShort =
        timeDiff < shortTimer && timeDiff > 0 && notifiedType !== "short";
      const shouldNotifyLong =
        timeDiff < longTimer &&
        timeDiff > shortTimer &&
        notifiedType !== "long";

      if (timeDiff < 0) {
        deleteEvent(db, eventItem);
        delete event[eventItem.date];
      }

      if (shouldNotifyLong || shouldNotifyShort) {
        if (process.env.mode === "1") { //decide for plain message or embed Message
          const embed = await embedTemplate(eventItem, client);
          client.channels.cache
            .find((channel) => channel.id === eventItem.channelId)
            .send({
              embeds: [embed],
            });
        } else {
          client.channels.cache
            .find((channel) => channel.id === eventItem.channelId)
            .send(
              `${process.env.messageToUsers} ${eventItem.event}, ${eventItem.date}`
            );
        }

        event[eventItem.date] = {
          notified: shouldNotifyLong ? "long" : "short",
        };
        console.log(shouldNotifyLong ? "long timer" : "short timer");
      }
    }
  }, interval);
};
