const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'autoresponse-panel',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 1500,
  slashData: new SlashCommandBuilder().setName('autoresponse-panel').setDescription('لوحة إدارة الردود التلقائية'),
  async execute({ interaction, message, source }) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('autoresponse:add').setLabel('إضافة رد').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('autoresponse:list').setLabel('عرض الردود').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('autoresponse:clear').setLabel('حذف الكل').setStyle(ButtonStyle.Danger)
    );
    const payload = { content: 'لوحة الردود التلقائية', components: [row] };
    if (source === 'slash') return interaction.reply(payload);
    return message.reply(payload);
  }
};
