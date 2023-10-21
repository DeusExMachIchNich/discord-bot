export const interactionMapper = (interaction) => {
  return {
    userId: interaction.user ? interaction.user.id : interaction.userId,
    event: interaction.user
      ? interaction.options.get("event").value
      : interaction.event,
    date: interaction.user
      ? interaction.options.get("date").value +
        " " +
        interaction.options.get("time").value
      : interaction.date,
    channelId: interaction.channelId,
  };
};
