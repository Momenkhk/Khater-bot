const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  category: 'general',
  cooldown: 1000,
  slashData: new SlashCommandBuilder().setName('serverinfo').setDescription('Show server info'),
  async execute({ interaction, message, source }) {
    const guild = interaction?.guild || message.guild;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;
    const txt = `Server: ${guild.name}\nMembers: ${guild.memberCount}\nHumans: ${guild.memberCount - bots}\nBots: ${bots}\nCreated: <t:${Math.floor(guild.createdTimestamp / 1000)}:D>`;
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: true });
    return message.reply(txt);
  }
};
