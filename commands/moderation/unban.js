const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unban',
  category: 'admin',
  permissions: [PermissionFlagsBits.BanMembers],
  cooldown: 2500,
  slashData: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban by user ID')
    .addStringOption((o) => o.setName('userid').setDescription('User ID').setRequired(true)),
  async execute({ interaction, message, args, source }) {
    const guild = interaction?.guild || message.guild;
    const userId = interaction?.options?.getString('userid') || args[0];
    if (!userId) return source === 'slash' ? interaction.reply({ content: 'User ID required.', ephemeral: true }) : message.reply('User ID required.');
    await guild.members.unban(userId);
    const txt = `Unbanned ${userId}.`;
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: true });
    return message.reply(txt);
  }
};
