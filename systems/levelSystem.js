module.exports = {
  async onMessage(message) {
    if (!message.guild || message.author.bot) return;
    const cfg = message.client.db.findOne('guildConfigs', { guildId: message.guild.id }) || { leveling: { enabled: true, multiplier: 1 } };
    if (!cfg?.leveling?.enabled) return;

    const now = Date.now();
    const current = message.client.db.findOne('levels', { guildId: message.guild.id, userId: message.author.id }) || {
      guildId: message.guild.id,
      userId: message.author.id,
      xp: 0,
      voiceXp: 0,
      level: 1,
      lastGainAt: 0
    };

    if (now - current.lastGainAt < 15000) return;

    const gain = Math.floor((8 + Math.random() * 10) * (cfg.leveling.multiplier || 1));
    current.xp += gain;
    current.lastGainAt = now;

    const required = current.level * 100;
    if (current.xp >= required) {
      current.level += 1;
      await message.channel.send(`${message.author}, you reached level ${current.level}!`);
    }

    message.client.db.upsert('levels', { guildId: current.guildId, userId: current.userId }, current);
  }
};
