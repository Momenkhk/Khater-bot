const Level = require('../models/Level');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
  async onMessage(message) {
    if (!message.guild || message.author.bot) return;
    const cfg = await GuildConfig.findOne({ guildId: message.guild.id }).lean();
    if (!cfg?.leveling?.enabled) return;

    const now = Date.now();
    const record = await Level.findOneAndUpdate(
      { guildId: message.guild.id, userId: message.author.id },
      { $setOnInsert: { xp: 0, level: 1, lastGainAt: 0 } },
      { upsert: true, new: true }
    );

    if (now - record.lastGainAt < 15000) return;

    const gain = Math.floor((8 + Math.random() * 10) * (cfg.leveling.multiplier || 1));
    record.xp += gain;
    record.lastGainAt = now;

    const required = record.level * 100;
    if (record.xp >= required) {
      record.level += 1;
      await message.channel.send(`${message.author}, you reached level ${record.level}!`);
    }

    await record.save();
  }
};
