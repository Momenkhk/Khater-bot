const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unlock',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageChannels],
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('unlock').setDescription('Unlock current channel'),
  async execute({ interaction, message, source }) {
    const channel = interaction?.channel || message.channel;
    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: null });
    const txt = 'Channel unlocked.';
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: false });
    return message.reply(txt);
  }
};
