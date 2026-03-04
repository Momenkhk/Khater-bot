const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'temprole',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('temprole').setDescription('Assign temporary role scheduler'),
  async execute({ interaction, message, source }) {
    const text = 'Temporary role scheduler initialized.';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
