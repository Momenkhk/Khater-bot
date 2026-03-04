const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'security-panel',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 1500,
  slashData: new SlashCommandBuilder().setName('security-panel').setDescription('لوحة إعدادات الأمان'),
  async execute({ interaction, message, source }) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('security:toggle-mentions').setLabel('تفعيل/تعطيل حماية المنشن').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('security:toggle-commands').setLabel('تفعيل/تعطيل حماية سبام الأوامر').setStyle(ButtonStyle.Secondary)
    );
    const payload = { content: 'لوحة الأمان', components: [row] };
    if (source === 'slash') return interaction.reply(payload);
    return message.reply(payload);
  }
};
