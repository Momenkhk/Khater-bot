const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'clearwarns',
  category: 'admin',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 2000,
  slashData: new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription('Clear user warnings')
    .addUserOption((o) => o.setName('user').setDescription('Target user').setRequired(true)),
  async execute({ client, interaction, message, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const targetUser = interaction?.options?.getUser('user') || message.mentions.users.first();
    if (!targetUser) {
      const txt = 'Please mention/select a user.';
      return source === 'slash' ? interaction.reply({ content: txt, ephemeral: false }) : message.reply(txt);
    }

    const deleted = client.db.deleteMany('warnings', { guildId, userId: targetUser.id });
    const text = `Cleared ${deleted} warnings for <@${targetUser.id}>.`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
