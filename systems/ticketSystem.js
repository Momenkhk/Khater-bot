const { ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
  async createTicket(interaction, category = 'general') {
    const cfg = interaction.client.db.findOne('guildConfigs', { guildId: interaction.guild.id }) || { tickets: { maxPerUser: 2 } };
    const openCount = interaction.client.db.find('tickets', { guildId: interaction.guild.id, userId: interaction.user.id, status: 'open' }).length;
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

    interaction.client.db.insert('tickets', { guildId: interaction.guild.id, channelId: channel.id, userId: interaction.user.id, category, status: 'open' });
    return interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
  }
};
