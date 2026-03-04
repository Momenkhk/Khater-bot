const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'lock',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageChannels],
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('lock').setDescription('Lock current channel'),
  async execute({ interaction, message, source }) {
    const channel = interaction?.channel || message.channel;
    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });
    const txt = 'Channel locked.';
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: false });
    return message.reply(txt);
  }
};
