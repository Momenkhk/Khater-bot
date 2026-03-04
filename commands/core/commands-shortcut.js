const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const shortcutSystem = require('../../systems/shortcutSystem');

module.exports = {
  name: 'commands-shortcut',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 1500,
  slashData: new SlashCommandBuilder()
    .setName('commands-shortcut')
    .setDescription('Open command shortcuts management panel'),
  async execute({ client, interaction, message, source }) {
    const panel = shortcutSystem.buildPanel(client);
    const payload = { content: 'Command Shortcuts Panel', ...panel };
    if (source === 'slash') return interaction.reply({ ...payload, ephemeral: true });
    return message.reply(payload);
  }
};
