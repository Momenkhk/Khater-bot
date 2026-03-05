const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'massrole',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 3000,
  slashData: new SlashCommandBuilder().setName('massrole').setDescription('Moderation action: massrole'),
  async execute({ interaction, message, source }) {
    const text = 'Executed moderation command: massrole';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
