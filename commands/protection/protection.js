const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'protection',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('protection').setDescription('Show anti-raid status'),
  async execute({ interaction, message, source, client }) {
    const guildId = interaction?.guildId || message.guild.id;
    const state = client.db.findOne('protection', { guildId });
    const text = state?.raidMode ? `Raid mode active until ${new Date(state.lockdownUntil).toISOString()}` : 'Protection status normal';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
