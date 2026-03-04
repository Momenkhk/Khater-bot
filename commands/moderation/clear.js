const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'clear',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageMessages],
  cooldown: 2500,
  slashData: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Bulk delete messages')
    .addIntegerOption((o) => o.setName('amount').setDescription('1-100').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute({ interaction, message, args, source }) {
    const amount = interaction?.options?.getInteger('amount') || Number(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      const txt = 'Amount must be between 1 and 100.';
      return source === 'slash' ? interaction.reply({ content: txt, ephemeral: true }) : message.reply(txt);
    }
    const channel = interaction?.channel || message.channel;
    await channel.bulkDelete(amount, true);
    const txt = `Deleted ${amount} messages.`;
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: true });
    return message.reply(txt);
  }
};
