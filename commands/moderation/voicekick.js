const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'voicekick',
  permissions: [PermissionFlagsBits.ModerateMembers],
  cooldown: 3000,
  slashData: new SlashCommandBuilder().setName('voicekick').setDescription('Moderation action: voicekick'),
  async execute({ interaction, message, source }) {
    const text = 'Executed moderation command: voicekick';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
