const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'voicestats',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('voicestats').setDescription('Voice activity overview'),
  async execute({ interaction, message, source }) {
    const guild = interaction?.guild || message.guild;
    const active = guild.channels.cache.filter((c) => c.isVoiceBased() && c.members.size > 0).size;
    const text = `Active voice channels: ${active}`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
