const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'untimeout',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 3000,
  slashData: new SlashCommandBuilder().setName('untimeout').setDescription('Moderation action: untimeout'),
  async execute({ interaction, message, source }) {
    const text = 'Executed moderation command: untimeout';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
