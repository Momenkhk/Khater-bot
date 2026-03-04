const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  category: 'admin',
  permissions: [PermissionFlagsBits.BanMembers],
  cooldown: 2500,
  slashData: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption((o) => o.setName('user').setDescription('Target').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason')),
  async execute({ interaction, message, args, source }) {
    const user = interaction?.options?.getUser('user') || message.mentions.users.first();
    const reason = interaction?.options?.getString('reason') || args.slice(1).join(' ') || 'No reason';
    if (!user) return source === 'slash' ? interaction.reply({ content: 'User required.', ephemeral: true }) : message.reply('User required.');
    const member = await (interaction?.guild || message.guild).members.fetch(user.id).catch(() => null);
    if (!member?.bannable) return source === 'slash' ? interaction.reply({ content: 'I cannot ban this user.', ephemeral: true }) : message.reply('I cannot ban this user.');
    await member.ban({ reason });
    const txt = `Banned <@${user.id}>.`;
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: true });
    return message.reply(txt);
  }
};
