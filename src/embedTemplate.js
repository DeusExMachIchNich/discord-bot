import { EmbedBuilder } from "discord.js";

export const embedTemplate = async (event, client) => {
  const user = await client.users.fetch(event.userId);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(event.event)
    .setURL(process.env.embedTitleURL)
    .setAuthor({
      name: user.globalName,
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setDescription(process.env.embedMessageToUsers)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .addFields(
      { name: "Date & Time:", value: event.date },
      { name: "\u200B", value: "\u200B" }
    )
    .setImage(process.env.embedBigPictureURL)
    .setTimestamp()
    .setFooter({
      text: "D&D Dungeon-Bot",
      iconURL: user.displayAvatarURL({ dynamic: true }),
    });

  return embed;
};
