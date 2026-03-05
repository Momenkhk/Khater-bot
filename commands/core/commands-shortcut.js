const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const shortcutSystem = require('../../systems/shortcutSystem');

module.exports = {
  name: 'commands-shortcut',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 1500,
  slashData: new SlashCommandBuilder().setName('commands-shortcut').setDescription('فتح لوحة اختصارات الأوامر'),
  async execute({ client, interaction, message, source }) {
    const panel = shortcutSystem.buildPanel(client);
    const payload = { content: 'لوحة اختصارات الأوامر', ...panel };
    if (source === 'slash') return interaction.reply(payload);
    return message.reply(payload);
  }
};
