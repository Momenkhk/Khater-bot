const { SlashCommandBuilder } = require('discord.js');
const { getUserLang } = require('../../utils/i18n');

module.exports = {
  name: 'profile',
  cooldown: 1500,
  slashData: new SlashCommandBuilder().setName('profile').setDescription('Show your bot profile'),
  async execute({ client, interaction, message, source }) {
    const userId = interaction?.user?.id || message?.author?.id;
    const lang = getUserLang(client, userId);
    const text = lang === 'ar' ? `ملفك: اللغة ${lang}` : `Profile: language ${lang}`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
