const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'leaderboard',
  cooldown: 4000,
  slashData: new SlashCommandBuilder().setName('leaderboard').setDescription('Level leaderboard'),
  async execute({ interaction, message, source, client }) {
    const guildId = interaction?.guildId || message.guild.id;
    const top = client.db.find('levels', { guildId }).sort((a, b) => (b.level - a.level) || (b.xp - a.xp)).slice(0, 10);
    const body = top.map((u, i) => `${i + 1}. <@${u.userId}> • L${u.level} (${u.xp}xp)`).join('\n') || 'No data';
    if (source === 'slash') return interaction.reply({ content: body, ephemeral: true });
    return message.reply(body);
  }
};
