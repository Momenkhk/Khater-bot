const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  MessageFlags
} = require('discord.js');

module.exports = {
  name: 'rolepanel',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('rolepanel').setDescription('Create a Components v2 role panel'),
  async execute({ interaction, message, source }) {
    const toggleRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('roles:toggle:announcements').setLabel('Toggle Announcements').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('roles:unique:events').setLabel('Unique Events Role').setStyle(ButtonStyle.Secondary)
    );

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('roles:select')
        .setPlaceholder('Pick your interests')
        .setMinValues(0)
        .setMaxValues(2)
        .addOptions([
          { label: 'Giveaways', value: 'giveaways' },
          { label: 'Announcements', value: 'announcements' },
          { label: 'Events', value: 'events' }
        ])
    );

    const payload = {
      flags: MessageFlags.IsComponentsV2,
      components: [toggleRow, selectRow]
    };

    if (source === 'slash') return interaction.reply(payload);
    return message.reply(payload);
  }
};
