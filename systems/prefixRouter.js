const GuildConfig = require('../models/GuildConfig');
const enforceCooldown = require('../utils/cooldownManager');
const SlidingWindowLimiter = require('../utils/rateLimiter');

module.exports = function createPrefixRouter(client) {
  const limiter = new SlidingWindowLimiter(client.config.security.globalRateLimit, client.config.security.windowMs);

  return async function prefixRouter(message) {
    if (!message.guild || message.author.bot) return;

    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id }).lean();
    const prefix = guildConfig?.prefix || client.config.prefix;
    if (!message.content.startsWith(prefix)) return;

    if (!limiter.hit(`${message.guild.id}:${message.author.id}`)) return;

    const [commandName, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = client.prefixCommands.get(commandName?.toLowerCase());
    if (!command) return;

    const cooldown = enforceCooldown(client, `${message.author.id}:${command.name}`, command.cooldown || 2000);
    if (cooldown) return message.reply(`Cooldown active: ${cooldown}s`);

    try {
      await command.execute({ client, message, args, source: 'prefix' });
    } catch (error) {
      console.error('[PREFIX_COMMAND_ERROR]', error);
      await message.reply('Command execution failed.');
    }
  };
};
