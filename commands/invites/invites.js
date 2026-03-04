const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'invites',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('invites').setDescription('Invite leaderboard'),
  async execute({ interaction, message, source, client }) {
    const guildId = interaction?.guildId || message.guild.id;
    const top = client.db.find('invites', { guildId }).sort((a, b) => b.uses - a.uses).slice(0, 10);
    const text = top.map((x, i) => `${i + 1}. <@${x.inviterId}> - ${x.uses}`).join('\n') || 'No invite data';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
