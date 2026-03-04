const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'slowmode',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageChannels],
  cooldown: 2500,
  slashData: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set channel slowmode in seconds')
    .addIntegerOption((o) => o.setName('seconds').setDescription('0-21600').setRequired(true).setMinValue(0).setMaxValue(21600)),
  async execute({ interaction, message, args, source }) {
    const seconds = interaction?.options?.getInteger('seconds') ?? Number(args[0]);
    const channel = interaction?.channel || message.channel;
    await channel.setRateLimitPerUser(seconds || 0, 'Configured by command');
    const txt = `Slowmode set to ${seconds || 0}s.`;
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: true });
    return message.reply(txt);
  }
};
