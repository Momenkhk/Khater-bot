const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('help').setDescription('Display command modules'),
  async execute({ client, interaction, message, source }) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Khater Bot - System Modules')
      .setDescription('Core, Welcome, AutoResponse, Leveling, Moderation, AutoMod, Logging, ReactionRoles, Tickets, TempRoles, Invites, Stats, AntiRaid, Voice.')
      .addFields({ name: 'Commands loaded', value: `${client.prefixCommands.size}` });

    if (source === 'slash') return interaction.reply({ embeds: [embed], ephemeral: true });
    return message.reply({ embeds: [embed] });
  }
};
