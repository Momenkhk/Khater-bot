const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'serverstats',
  cooldown: 3000,
  slashData: new SlashCommandBuilder().setName('serverstats').setDescription('Show advanced server statistics'),
  async execute({ interaction, message, source }) {
    const guild = interaction?.guild || message.guild;
    const humans = guild.memberCount - guild.members.cache.filter((m) => m.user.bot).size;
    const text = `Total: ${guild.memberCount} | Humans: ${humans} | Boosts: ${guild.premiumSubscriptionCount}`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
