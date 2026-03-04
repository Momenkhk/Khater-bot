const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ticketSystem = require('../../systems/ticketSystem');

module.exports = {
  name: 'ticket-builder',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 1500,
  slashData: new SlashCommandBuilder().setName('ticket-builder').setDescription('إرسال بنل منشئ التذاكر'),
  async execute(ctx) {
    return ticketSystem.sendBuilderPanel(ctx);
  }
};
