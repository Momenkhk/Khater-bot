const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const loadCommands = require('../../handlers/commandHandler');
const { t } = require('../../utils/i18n');

module.exports = {
  name: 'reload',
  cooldown: 1000,
  slashData: new SlashCommandBuilder().setName('reload').setDescription('Reload all commands'),
  async execute({ client, interaction, message, source }) {
    const authorId = interaction?.user?.id || message?.author?.id;
    if (!client.config.owners.includes(authorId)) {
      const txt = t(client, authorId, 'OWNER_ONLY');
      if (source === 'slash') return interaction.reply({ content: txt, ephemeral: false });
      return message.reply(txt);
    }

    await loadCommands(client, path.join(__dirname, '..'));
    if (source === 'slash') return interaction.reply({ content: 'Reloaded ✅', ephemeral: false });
    return message.reply('Reloaded ✅');
  }
};
