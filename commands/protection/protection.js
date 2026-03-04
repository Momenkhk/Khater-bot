const { SlashCommandBuilder } = require('discord.js');
const ProtectionState = require('../../models/ProtectionState');

module.exports = {
  name: 'protection',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('protection').setDescription('Show anti-raid status'),
  async execute({ interaction, message, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const state = await ProtectionState.findOne({ guildId }).lean();
    const text = state?.raidMode ? `Raid mode active until ${state.lockdownUntil}` : 'Protection status normal';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
