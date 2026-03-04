const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'language',
  category: 'general',
  cooldown: 1000,
  slashData: new SlashCommandBuilder().setName('language').setDescription('اللغة العربية مفعلة بشكل افتراضي'),
  async execute({ interaction, message, source }) {
    const text = 'تم اعتماد العربية كلغة أساسية للبوت.';
    if (source === 'slash') return interaction.reply({ content: text });
    return message.reply(text);
  }
};
