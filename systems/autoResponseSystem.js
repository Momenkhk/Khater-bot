const cooldowns = new Map();

module.exports = async function autoResponseSystem(message) {
  if (!message.guild || message.author.bot) return;

  const rules = message.client.db.find('autoResponses', { guildId: message.guild.id });
  for (const rule of rules) {
    if (rule.enabledChannels?.length && !rule.enabledChannels.includes(message.channel.id)) continue;

    const key = `${message.guild.id}:${rule.id}:${message.author.id}`;
    const now = Date.now();
    if (cooldowns.get(key) > now) continue;

    let matched = false;
    if (rule.isRegex) {
      const regex = new RegExp(rule.trigger, rule.caseSensitive ? '' : 'i');
      matched = regex.test(message.content);
    } else {
      const source = rule.caseSensitive ? message.content : message.content.toLowerCase();
      const target = rule.caseSensitive ? rule.trigger : String(rule.trigger).toLowerCase();
      matched = source.includes(target);
    }

    if (matched) {
      cooldowns.set(key, now + (rule.cooldownMs || 3000));
      await message.channel.send(rule.response);
    }
  }
};
