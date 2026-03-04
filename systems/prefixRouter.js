const enforceCooldown = require('../utils/cooldownManager');
const SlidingWindowLimiter = require('../utils/rateLimiter');
const { t } = require('../utils/i18n');

module.exports = function createPrefixRouter(client) {
  const limiter = new SlidingWindowLimiter(client.config.security.globalRateLimit, client.config.security.windowMs);

  return async function prefixRouter(message) {
    if (!message.guild || message.author.bot) return;

    const sec = client.systems.security.validateMessage(message);
    if (!sec.ok) return;

    const guildConfig = client.db.findOne('guildConfigs', { guildId: message.guild.id });
    const prefix = guildConfig?.prefix || client.config.prefix;
    if (!message.content.startsWith(prefix)) return;

    if (!limiter.hit(`${message.guild.id}:${message.author.id}`)) return;

    const [commandNameRaw, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    const raw = (commandNameRaw || '').toLowerCase();
    const aliasMap = guildConfig?.commandShortcuts || {};
    const commandName = aliasMap[raw] || raw;
    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    const scope = client.systems.security.validateCommandUse(`prefix:${message.guild.id}:${message.author.id}:${command.name}`);
    if (!scope.ok) return message.reply(scope.reason);

    const langArg = args.find((x) => ['--ar', '--en'].includes(x));
    if (langArg) {
      client.db.upsert('users', { userId: message.author.id }, { lang: langArg === '--ar' ? 'ar' : 'en' });
    }

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
