const ticketSystem = require('../systems/ticketSystem');
const shortcutSystem = require('../systems/shortcutSystem');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === 'ticket:create') return ticketSystem.createTicket(interaction);
      if (interaction.customId.startsWith('shortcut:')) return shortcutSystem.handleButton(interaction);
      if (interaction.customId.startsWith('welcome_ack:')) {
        return interaction.reply({ content: 'Thanks for acknowledging rules.', ephemeral: true });
      }
      if (interaction.customId.startsWith('roles:toggle:')) {
        return interaction.reply({ content: 'Role toggle request received.', ephemeral: true });
      }
      if (interaction.customId.startsWith('roles:unique:')) {
        return interaction.reply({ content: 'Unique role request received.', ephemeral: true });
      }
    }

    if (interaction.isModalSubmit() && interaction.customId.startsWith('shortcut:')) {
      return shortcutSystem.handleModal(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'roles:select') {
        return interaction.reply({ content: `Selected: ${interaction.values.join(', ') || 'none'}`, ephemeral: true });
      }
      if (interaction.customId === 'shortcut:select-command') {
        return interaction.reply({ content: `Selected command: ${interaction.values[0]}`, ephemeral: true });
      }
    }

    return client.systems.interactionRouter(interaction);
  }
};
