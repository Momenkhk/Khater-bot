const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../../utils/i18n');

module.exports = {
  name: 'language',
  cooldown: 1000,
  slashData: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change your language / تغيير لغتك')
    .addStringOption((o) => o.setName('lang').setDescription('Choose language').setRequired(true).addChoices(
      { name: 'English', value: 'en' },
      { name: 'العربية', value: 'ar' }
    )),
  async execute({ client, interaction, message, args, source }) {
    const userId = interaction?.user?.id || message?.author?.id;
    const lang = interaction?.options?.getString('lang') || (args[0] === 'ar' ? 'ar' : 'en');
    client.db.upsert('users', { userId }, { lang });

    const text = t(client, userId, 'LANG_SET');
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
