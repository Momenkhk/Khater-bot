const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

module.exports = {
  name: 'ticketpanel',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('ticketpanel').setDescription('Post ticket panel (Components v2)'),
  async execute({ interaction, message, source }) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket:create').setLabel('Open Ticket').setStyle(ButtonStyle.Primary)
    );

    const payload = {
      flags: MessageFlags.IsComponentsV2,
      components: [row]
    };

    if (source === 'slash') return interaction.reply({ ...payload, ephemeral: false });
    return message.reply(payload);
  }
};
