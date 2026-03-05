module.exports = async function handleAutoMod(message) {
  if (!message.guild || message.author.bot) return;

  const cfg = message.client.db.findOne('guildConfigs', { guildId: message.guild.id }) || { automod: { enabled: true, antiInvite: true, antiSpam: true, badWords: [] } };
  if (!cfg?.automod?.enabled) return;

  const content = message.content.toLowerCase();
  const checks = [
    cfg.automod.antiInvite && /discord\.gg\//.test(content),
    cfg.automod.antiSpam && /(.)\1{12,}/.test(content),
    Array.isArray(cfg.automod.badWords) && cfg.automod.badWords.some((word) => content.includes(word.toLowerCase()))
  ];

  if (checks.some(Boolean)) {
    await message.delete().catch(() => null);
    await message.channel.send(`${message.author}, blocked by AutoMod.`);
  }
};
