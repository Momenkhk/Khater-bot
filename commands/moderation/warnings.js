const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'warnings',
  category: 'admin',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 2000,
  slashData: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Show user warnings')
    .addUserOption((o) => o.setName('user').setDescription('Target user').setRequired(true)),
  async execute({ client, interaction, message, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const targetUser = interaction?.options?.getUser('user') || message.mentions.users.first();
    if (!targetUser) {
      const txt = 'Please mention/select a user.';
      return source === 'slash' ? interaction.reply({ content: txt, ephemeral: true }) : message.reply(txt);
    }

    const rows = client.db.find('warnings', { guildId, userId: targetUser.id }).slice(-10);
    const text = rows.length
      ? rows.map((w, i) => `${i + 1}) ${w.reason} • <@${w.moderatorId}>`).join('\n')
      : 'No warnings found.';

    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
