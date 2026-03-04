const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits
} = require('discord.js');

function isAdmin(member) {
  return member.permissions.has(PermissionFlagsBits.ManageGuild);
}

function getCfg(client, guildId) {
  return client.db.findOne('guildConfigs', { guildId }) || {};
}

function getAliases(client, guildId) {
  return getCfg(client, guildId).commandShortcuts || {};
}

function buildPanel(client) {
  const cmds = [...client.prefixCommands.values()]
    .filter((c) => c.name && c.category !== 'owner')
    .slice(0, 25)
    .map((c) => ({ label: c.name, value: c.name }));

  const selectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('shortcut:select-command')
      .setPlaceholder('Select command to create alias for')
      .setOptions(cmds)
  );

  const btnRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('shortcut:add').setLabel('Add/Update Alias').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('shortcut:remove').setLabel('Remove Alias').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('shortcut:list').setLabel('List Aliases').setStyle(ButtonStyle.Secondary)
  );

  return { components: [selectRow, btnRow] };
}

module.exports = {
  buildPanel,
  isAdmin,
  getAliases,
  getCfg,
  async handleButton(interaction) {
    if (!isAdmin(interaction.member)) return interaction.reply({ content: 'Manage Server permission required.', ephemeral: true });

    if (interaction.customId === 'shortcut:list') {
      const aliases = getAliases(interaction.client, interaction.guildId);
      const text = Object.keys(aliases).length
        ? Object.entries(aliases).map(([a, c]) => `\`${a}\` -> \`${c}\``).join('\n')
        : 'No aliases configured.';
      return interaction.reply({ content: text, ephemeral: true });
    }

    if (interaction.customId === 'shortcut:add') {
      const modal = new ModalBuilder().setCustomId('shortcut:add-modal').setTitle('Add Command Alias');
      modal.addComponents(
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('command').setLabel('Command Name').setRequired(true).setStyle(TextInputStyle.Short)),
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('alias').setLabel('Alias').setRequired(true).setStyle(TextInputStyle.Short))
      );
      return interaction.showModal(modal);
    }

    if (interaction.customId === 'shortcut:remove') {
      const modal = new ModalBuilder().setCustomId('shortcut:remove-modal').setTitle('Remove Command Alias');
      modal.addComponents(
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('alias').setLabel('Alias').setRequired(true).setStyle(TextInputStyle.Short))
      );
      return interaction.showModal(modal);
    }
  },

  async handleModal(interaction) {
    if (!isAdmin(interaction.member)) return interaction.reply({ content: 'Manage Server permission required.', ephemeral: true });

    const cfg = getCfg(interaction.client, interaction.guildId);
    const commandShortcuts = { ...(cfg.commandShortcuts || {}) };

    if (interaction.customId === 'shortcut:add-modal') {
      const command = interaction.fields.getTextInputValue('command').trim().toLowerCase();
      const alias = interaction.fields.getTextInputValue('alias').trim().toLowerCase();

      if (!interaction.client.prefixCommands.has(command)) {
        return interaction.reply({ content: 'Invalid command name.', ephemeral: true });
      }
      if (!/^[a-z0-9_-]{2,20}$/.test(alias)) {
        return interaction.reply({ content: 'Alias must be 2-20 chars: a-z 0-9 _ -', ephemeral: true });
      }

      commandShortcuts[alias] = command;
      interaction.client.db.upsert('guildConfigs', { guildId: interaction.guildId }, { ...cfg, commandShortcuts });
      return interaction.reply({ content: `Alias saved: \`${alias}\` -> \`${command}\``, ephemeral: true });
    }

    if (interaction.customId === 'shortcut:remove-modal') {
      const alias = interaction.fields.getTextInputValue('alias').trim().toLowerCase();
      if (!commandShortcuts[alias]) {
        return interaction.reply({ content: 'Alias not found.', ephemeral: true });
      }
      delete commandShortcuts[alias];
      interaction.client.db.upsert('guildConfigs', { guildId: interaction.guildId }, { ...cfg, commandShortcuts });
      return interaction.reply({ content: `Alias removed: \`${alias}\``, ephemeral: true });
    }
  }
};
