const { ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  async sendBuilderPanel(ctx) {
    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('🎫 منشئ التذاكر المتطور')
      .setDescription('اضغط على الزر لفتح تذكرة دعم جديدة.');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket:create').setLabel('فتح تذكرة').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ticket:claim').setLabel('استلام التذكرة').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('ticket:close').setLabel('إغلاق التذكرة').setStyle(ButtonStyle.Danger)
    );

    const payload = { embeds: [embed], components: [row] };
    if (ctx.interaction) return ctx.interaction.reply(payload);
    return ctx.message.reply(payload);
  },

  async createTicket(interaction, category = 'عام') {
    const cfg = interaction.client.db.findOne('guildConfigs', { guildId: interaction.guild.id }) || { tickets: { maxPerUser: 2 } };
    const openCount = interaction.client.db.find('tickets', { guildId: interaction.guild.id, userId: interaction.user.id, status: 'open' }).length;
    if (openCount >= (cfg?.tickets?.maxPerUser || 2)) {
      return interaction.reply({ content: 'وصلت للحد الأقصى للتذاكر.', ephemeral: false });
    }

    const channel = await interaction.guild.channels.create({
      name: `تذكرة-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: cfg?.tickets?.categoryIds?.[0],
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });

    interaction.client.db.insert('tickets', { guildId: interaction.guild.id, channelId: channel.id, userId: interaction.user.id, category, status: 'open' });
    return interaction.reply({ content: `تم إنشاء التذكرة: ${channel}` });
  },

  async claimTicket(interaction) {
    const ticket = interaction.client.db.findOne('tickets', { guildId: interaction.guild.id, channelId: interaction.channelId, status: 'open' });
    if (!ticket) return interaction.reply({ content: 'هذا ليس قناة تذكرة مفتوحة.' });
    interaction.client.db.upsert('tickets', { guildId: ticket.guildId, channelId: ticket.channelId }, { ...ticket, claimedBy: interaction.user.id });
    return interaction.reply({ content: `تم استلام التذكرة بواسطة <@${interaction.user.id}>` });
  },

  async closeTicket(interaction) {
    const ticket = interaction.client.db.findOne('tickets', { guildId: interaction.guild.id, channelId: interaction.channelId, status: 'open' });
    if (!ticket) return interaction.reply({ content: 'هذه القناة ليست تذكرة مفتوحة.' });
    interaction.client.db.upsert('tickets', { guildId: ticket.guildId, channelId: ticket.channelId }, { ...ticket, status: 'closed', closedBy: interaction.user.id });
    await interaction.reply({ content: 'تم إغلاق التذكرة، سيتم الأرشفة خلال ثواني.' });
    setTimeout(() => interaction.channel.delete().catch(() => null), 5000);
  }
};
