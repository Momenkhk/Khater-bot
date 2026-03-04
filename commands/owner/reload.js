const { SlashCommandBuilder } = require('discord.js');
const loadCommands = require('../../handlers/commandHandler');

module.exports = {
  name: 'reload',
  cooldown: 1000,
  slashData: new SlashCommandBuilder().setName('reload').setDescription('Reload all commands'),
  async execute({ client, interaction, message, source }) {
    const authorId = interaction?.user?.id || message?.author?.id;
    if (!client.config.owners.includes(authorId)) {
      if (source === 'slash') return interaction.reply({ content: 'Owner only', ephemeral: true });
      return message.reply('Owner only');
    }

    await loadCommands(client, require('path').join(__dirname, '..'));
    if (source === 'slash') return interaction.reply({ content: 'Reloaded', ephemeral: true });
    return message.reply('Reloaded');
  }
};
