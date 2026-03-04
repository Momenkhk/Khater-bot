const { SlashCommandBuilder } = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
  name: 'leaderboard',
  cooldown: 4000,
  slashData: new SlashCommandBuilder().setName('leaderboard').setDescription('Level leaderboard'),
  async execute({ interaction, message, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const top = await Level.find({ guildId }).sort({ level: -1, xp: -1 }).limit(10).lean();
    const body = top.map((u, i) => `${i + 1}. <@${u.userId}> • L${u.level} (${u.xp}xp)`).join('\n') || 'No data';
    if (source === 'slash') return interaction.reply({ content: body, ephemeral: true });
    return message.reply(body);
  }
};
