export const interactionMapper = (interaction) => {
  return {
    userId: interaction.user ? interaction.user.id : interaction.userId,
    appointment: interaction.user
      ? interaction.options.get("appointment").value
      : interaction.appointment,
    date: interaction.user
      ? interaction.options.get("appointmentdate").value +
        " " +
        interaction.options.get("appointmenttime").value
      : interaction.date,
    channelId: interaction.channelId,
  };
};
