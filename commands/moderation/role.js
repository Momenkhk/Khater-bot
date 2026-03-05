const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'role',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 3000,
  slashData: new SlashCommandBuilder().setName('role').setDescription('Moderation action: role'),
  async execute({ interaction, message, source }) {
    const text = 'Executed moderation command: role';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
