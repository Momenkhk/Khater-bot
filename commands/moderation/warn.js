const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'warn',
  category: 'admin',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 2000,
  slashData: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption((o) => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason').setRequired(false)),
  async execute({ client, interaction, message, args, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const moderatorId = interaction?.user?.id || message.author.id;
    const targetUser = interaction?.options?.getUser('user') || message.mentions.users.first();
    if (!targetUser) {
      const txt = 'Please mention/select a user.';
      return source === 'slash' ? interaction.reply({ content: txt, ephemeral: false }) : message.reply(txt);
    }
    const reason = interaction?.options?.getString('reason') || args.slice(1).join(' ') || 'No reason provided';
    client.db.insert('warnings', { guildId, userId: targetUser.id, moderatorId, reason });
    const count = client.db.find('warnings', { guildId, userId: targetUser.id }).length;
    const text = `Warned <@${targetUser.id}>. Total warnings: ${count}`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
