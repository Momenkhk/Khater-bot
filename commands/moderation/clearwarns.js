const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'clearwarns',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 3000,
  slashData: new SlashCommandBuilder().setName('clearwarns').setDescription('Moderation action: clearwarns'),
  async execute({ interaction, message, source }) {
    const text = 'Executed moderation command: clearwarns';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
