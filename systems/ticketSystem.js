const { ChannelType, PermissionsBitField } = require('discord.js');
const Ticket = require('../models/Ticket');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
  async createTicket(interaction, category = 'general') {
    const cfg = await GuildConfig.findOne({ guildId: interaction.guild.id }).lean();
    const openCount = await Ticket.countDocuments({ guildId: interaction.guild.id, userId: interaction.user.id, status: 'open' });
    if (openCount >= (cfg?.tickets?.maxPerUser || 2)) {
      return interaction.reply({ content: 'Ticket limit reached.', ephemeral: true });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: cfg?.tickets?.categoryIds?.[0],
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });

    await Ticket.create({ guildId: interaction.guild.id, channelId: channel.id, userId: interaction.user.id, category });
    return interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
  }
};
