const SlidingWindowLimiter = require('../utils/rateLimiter');
const store = require('../src/database/fileStore');

module.exports = function createSecuritySystem(client) {
  const commandLimiter = new SlidingWindowLimiter(8, 8000);

  function isWhitelisted(guildId, userId) {
    const wl = store.get('whitelist', guildId);
    return Array.isArray(wl.users) && wl.users.includes(userId);
  }

  function validateMessage(message) {
    if (!message.guild || message.author.bot) return { ok: false };
    if (isWhitelisted(message.guild.id, message.author.id)) return { ok: true };

    const cfg = store.get('security', message.guild.id);
    if (cfg.mentionsGuard !== false) {
      const mentionCount = (message.mentions.users?.size || 0) + (message.mentions.roles?.size || 0);
      if (mentionCount > (client.config.security.maxMentions || 5)) {
        return { ok: false, reason: 'تم منع الرسالة: عدد المنشن كبير.' };
      }
    }

    return { ok: true };
  }

  function validateCommandUse(scopeKey, guildId, userId) {
    if (guildId && userId && isWhitelisted(guildId, userId)) return { ok: true };
    const cfg = guildId ? store.get('security', guildId) : {};
    if (cfg.commandGuard === false) return { ok: true };

    if (!commandLimiter.hit(scopeKey)) {
      return { ok: false, reason: 'تم إيقاف التنفيذ مؤقتًا بسبب الاستخدام المتكرر.' };
    }
    return { ok: true };
  }

  return { validateMessage, validateCommandUse };
};
