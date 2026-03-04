const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'kick',
  category: 'admin',
  permissions: [PermissionFlagsBits.KickMembers],
  cooldown: 2500,
  slashData: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption((o) => o.setName('user').setDescription('Target').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason')),
  async execute({ interaction, message, args, source }) {
    const user = interaction?.options?.getUser('user') || message.mentions.users.first();
    const reason = interaction?.options?.getString('reason') || args.slice(1).join(' ') || 'No reason';
    if (!user) return source === 'slash' ? interaction.reply({ content: 'User required.', ephemeral: true }) : message.reply('User required.');
    const member = await (interaction?.guild || message.guild).members.fetch(user.id).catch(() => null);
    if (!member?.kickable) return source === 'slash' ? interaction.reply({ content: 'I cannot kick this user.', ephemeral: true }) : message.reply('I cannot kick this user.');
    await member.kick(reason);
    const txt = `Kicked <@${user.id}>.`;
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: true });
    return message.reply(txt);
  }
};
