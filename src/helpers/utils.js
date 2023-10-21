export const isCurrentDateTimeClose = (eventString) => {
  try {
    // Create a Date object for the current date in Berlin's timezone
    const currentDate = new Date();
  
    // Split the eventString date string into its components
    const eventParts = eventString?.includes(".")
      ? eventString?.split(/[\s/.:]+/)
      : eventString?.split(/[\s/,:]+/);

    // Create a Date object for the given date in Berlin's timezone
    const eventDate = new Date(
      parseInt(eventParts[2]),
      parseInt(eventParts[1]) - 1, // Month is 0-based in JavaScript
      parseInt(eventParts[0]),
      parseInt(eventParts[3]),
      parseInt(eventParts[4])
    );
    eventDate.toLocaleString("en-DE", { timeZone: "Europe/Berlin" });

    // Calculate the time difference in milliseconds
    return eventDate - currentDate;
  } catch (err) {
    console.log(err);
    return null;
  }
};

