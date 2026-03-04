const { SlashCommandBuilder } = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
  name: 'rank',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('rank').setDescription('Show rank card data'),
  async execute({ interaction, message, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const userId = interaction?.user.id || message.author.id;
    const level = await Level.findOne({ guildId, userId }).lean();
    const text = level ? `Level ${level.level} | XP ${level.xp} | Voice XP ${level.voiceXp}` : 'No rank data yet.';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
