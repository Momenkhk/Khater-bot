const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'nick',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 3000,
  slashData: new SlashCommandBuilder().setName('nick').setDescription('Moderation action: nick'),
  async execute({ interaction, message, source }) {
    const text = 'Executed moderation command: nick';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
