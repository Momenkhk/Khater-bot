const { EmbedBuilder } = require('discord.js');

module.exports = async function logEvent(guild, title, description) {
  const cfg = guild.client.db.findOne('guildConfigs', { guildId: guild.id });
  const channelId = cfg?.moderation?.logChannelId;
  if (!channelId) return;

  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;

  const embed = new EmbedBuilder().setColor(0x5865f2).setTitle(title).setDescription(description).setTimestamp();
  await channel.send({ embeds: [embed] }).catch(() => null);
};
