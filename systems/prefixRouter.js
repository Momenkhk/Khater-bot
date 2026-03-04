const enforceCooldown = require('../utils/cooldownManager');
const SlidingWindowLimiter = require('../utils/rateLimiter');
const { t } = require('../utils/i18n');

module.exports = function createPrefixRouter(client) {
  const limiter = new SlidingWindowLimiter(client.config.security.globalRateLimit, client.config.security.windowMs);

  return async function prefixRouter(message) {
    if (!message.guild || message.author.bot) return;

    const sec = client.systems.security.validateMessage(message);
    if (!sec.ok) return;

    const guildConfig = client.db.findOne('guildConfigs', { guildId: message.guild.id }) || {};
    const prefix = guildConfig.prefix || client.config.prefix;
    const aliasMap = guildConfig.commandShortcuts || {};

    const content = message.content.trim();
    let commandName = null;
    let args = [];

    if (content.startsWith(prefix)) {
      const parts = content.slice(prefix.length).trim().split(/\s+/);
      commandName = (parts.shift() || '').toLowerCase();
      args = parts;
    } else {
      const parts = content.split(/\s+/);
      const first = (parts[0] || '').toLowerCase();
      if (aliasMap[first]) {
        commandName = aliasMap[first];
        args = parts.slice(1);
      } else {
        return;
      }
    }

    if (!limiter.hit(`${message.guild.id}:${message.author.id}`)) return;

    commandName = aliasMap[commandName] || commandName;
    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    const scope = client.systems.security.validateCommandUse(`prefix:${message.guild.id}:${message.author.id}:${command.name}`, message.guild.id);
    if (!scope.ok) return message.reply(scope.reason);

    const cooldown = enforceCooldown(client, `${message.author.id}:${command.name}`, command.cooldown || 2000);
    if (cooldown) return message.reply(t(client, message.author.id, 'COOLDOWN', { s: cooldown }));

    try {
      await command.execute({ client, message, args, source: 'prefix' });
    } catch (error) {
      console.error('[PREFIX_COMMAND_ERROR]', error);
      await message.reply(t(client, message.author.id, 'COMMAND_FAILED'));
    }
  };
};
