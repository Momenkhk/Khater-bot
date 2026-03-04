const { SlashCommandBuilder } = require('discord.js');
const Invite = require('../../models/Invite');

module.exports = {
  name: 'invites',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('invites').setDescription('Invite leaderboard'),
  async execute({ interaction, message, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const top = await Invite.find({ guildId }).sort({ uses: -1 }).limit(10).lean();
    const text = top.map((x, i) => `${i + 1}. <@${x.inviterId}> - ${x.uses}`).join('\n') || 'No invite data';
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
