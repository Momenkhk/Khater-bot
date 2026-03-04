const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'autoresponse',
  cooldown: 2000,
  slashData: new SlashCommandBuilder()
    .setName('autoresponse')
    .setDescription('Create an auto response')
    .addStringOption((o) => o.setName('trigger').setDescription('Trigger').setRequired(true))
    .addStringOption((o) => o.setName('response').setDescription('Response').setRequired(true))
    .addBooleanOption((o) => o.setName('regex').setDescription('Regex trigger'))
    .addStringOption((o) => o.setName('lang').setDescription('Language / اللغة').addChoices({ name: 'English', value: 'en' }, { name: 'العربية', value: 'ar' })),
  async execute({ interaction, message, args, source, client }) {
    const guildId = interaction?.guildId || message.guild.id;
    const trigger = interaction?.options?.getString('trigger') || args[0];
    const response = interaction?.options?.getString('response') || args.slice(1).join(' ');
    const isRegex = interaction?.options?.getBoolean('regex') || false;

    client.db.insert('autoResponses', { guildId, trigger, response, isRegex, caseSensitive: false, enabledChannels: [], cooldownMs: 3000 });
    const text = `Auto response created for: ${trigger}`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
