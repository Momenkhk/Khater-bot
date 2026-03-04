const GuildConfig = require('../models/GuildConfig');

module.exports = async function handleAutoMod(message) {
  if (!message.guild || message.author.bot) return;

  const cfg = await GuildConfig.findOne({ guildId: message.guild.id }).lean();
  if (!cfg?.automod?.enabled) return;

  const content = message.content.toLowerCase();
  const checks = [
    cfg.automod.antiInvite && /discord\.gg\//.test(content),
    cfg.automod.antiSpam && /(.)\1{12,}/.test(content),
    cfg.automod.badWords?.length && cfg.automod.badWords.some((word) => content.includes(word.toLowerCase()))
  ];

  if (checks.some(Boolean)) {
    await message.delete().catch(() => null);
    await message.channel.send(`${message.author}, message blocked by AutoMod.`);
  }
};
