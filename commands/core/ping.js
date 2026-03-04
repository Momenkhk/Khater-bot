const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../../utils/i18n');

module.exports = {
  name: 'ping',
  cooldown: 1500,
  slashData: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Latency check')
    .addStringOption((o) => o.setName('lang').setDescription('Language / اللغة').addChoices(
      { name: 'English', value: 'en' },
      { name: 'العربية', value: 'ar' }
    )),
  async execute({ interaction, message, source, client }) {
    const latency = Date.now() - (interaction?.createdTimestamp || message?.createdTimestamp || Date.now());
    const userId = interaction?.user?.id || message?.author?.id;
    const text = t(client, userId, 'PING', { ms: latency });
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
