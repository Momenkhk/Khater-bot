const { SlashCommandBuilder } = require('discord.js');
const ticketSystem = require('../../systems/ticketSystem');

module.exports = {
  name: 'ticketpanel',
  category: 'admin',
  cooldown: 1200,
  slashData: new SlashCommandBuilder().setName('ticketpanel').setDescription('إرسال بنل التذاكر'),
  async execute(ctx) {
    return ticketSystem.sendBuilderPanel(ctx);
  }
};
