const SlidingWindowLimiter = require('../utils/rateLimiter');

module.exports = function createSecuritySystem(client) {
  const commandLimiter = new SlidingWindowLimiter(8, 8000);

  function validateMessage(message) {
    if (!message.guild || message.author.bot) return { ok: false };

    const mentionCount = (message.mentions.users?.size || 0) + (message.mentions.roles?.size || 0);
    if (mentionCount > (client.config.security.maxMentions || 5)) {
      return { ok: false, reason: 'Too many mentions in one message.' };
    }

    return { ok: true };
  }

  function validateCommandUse(scopeKey) {
    if (!commandLimiter.hit(scopeKey)) {
      return { ok: false, reason: 'Too many command attempts, slow down.' };
    }
    return { ok: true };
  }

  return { validateMessage, validateCommandUse };
};
