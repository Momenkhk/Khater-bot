const SlidingWindowLimiter = require('../utils/rateLimiter');

module.exports = function createSecuritySystem(client) {
  const commandLimiter = new SlidingWindowLimiter(8, 8000);

  function validateMessage(message) {
    if (!message.guild || message.author.bot) return { ok: false };
    const cfg = client.db.findOne('guildConfigs', { guildId: message.guild.id }) || {};

    if (cfg.security?.mentionsGuard !== false) {
      const mentionCount = (message.mentions.users?.size || 0) + (message.mentions.roles?.size || 0);
      if (mentionCount > (client.config.security.maxMentions || 5)) {
        return { ok: false, reason: 'تم منع الرسالة: عدد المنشن كبير.' };
      }
    }

    return { ok: true };
  }

  function validateCommandUse(scopeKey, guildId) {
    const cfg = guildId ? (client.db.findOne('guildConfigs', { guildId }) || {}) : {};
    if (cfg.security?.commandGuard === false) return { ok: true };

    if (!commandLimiter.hit(scopeKey)) {
      return { ok: false, reason: 'تم إيقاف التنفيذ مؤقتًا بسبب الاستخدام المتكرر.' };
    }
    return { ok: true };
  }

  return { validateMessage, validateCommandUse };
};
