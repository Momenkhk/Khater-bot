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
    .filter((c) => c.name)
    .slice(0, 25)
    .map((c) => ({ label: c.name, value: c.name }));

  const selectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('shortcut:select-command')
      .setPlaceholder('اختر الأمر المراد عمل اختصار له')
      .setOptions(cmds)
  );

  const btnRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('shortcut:add').setLabel('إضافة/تعديل اختصار').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('shortcut:remove').setLabel('حذف اختصار').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('shortcut:list').setLabel('عرض الاختصارات').setStyle(ButtonStyle.Secondary)
  );

  return { components: [selectRow, btnRow] };
}

module.exports = {
  buildPanel,
  isAdmin,
  getAliases,
  getCfg,
  async handleButton(interaction) {
    if (!isAdmin(interaction.member)) return interaction.reply({ content: 'تحتاج صلاحية إدارة السيرفر.', ephemeral: false });

    if (interaction.customId === 'shortcut:list') {
      const aliases = getAliases(interaction.client, interaction.guildId);
      const text = Object.keys(aliases).length
        ? Object.entries(aliases).map(([a, c]) => `\`${a}\` ← \`${c}\``).join('\n')
        : 'لا يوجد اختصارات حاليًا.';
      return interaction.reply({ content: text, ephemeral: false });
    }

    if (interaction.customId === 'shortcut:add') {
      const modal = new ModalBuilder().setCustomId('shortcut:add-modal').setTitle('إضافة اختصار أمر');
      modal.addComponents(
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('command').setLabel('اسم الأمر').setRequired(true).setStyle(TextInputStyle.Short)),
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('alias').setLabel('الاختصار').setRequired(true).setStyle(TextInputStyle.Short))
      );
      return interaction.showModal(modal);
    }

    if (interaction.customId === 'shortcut:remove') {
      const modal = new ModalBuilder().setCustomId('shortcut:remove-modal').setTitle('حذف اختصار أمر');
      modal.addComponents(
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('alias').setLabel('الاختصار').setRequired(true).setStyle(TextInputStyle.Short))
      );
      return interaction.showModal(modal);
    }
  },

  async handleModal(interaction) {
    if (!isAdmin(interaction.member)) return interaction.reply({ content: 'تحتاج صلاحية إدارة السيرفر.', ephemeral: false });

    const cfg = getCfg(interaction.client, interaction.guildId);
    const commandShortcuts = { ...(cfg.commandShortcuts || {}) };

    if (interaction.customId === 'shortcut:add-modal') {
      const command = interaction.fields.getTextInputValue('command').trim().toLowerCase();
      const alias = interaction.fields.getTextInputValue('alias').trim().toLowerCase();

      if (!interaction.client.prefixCommands.has(command)) {
        return interaction.reply({ content: 'اسم الأمر غير صحيح.', ephemeral: false });
      }
      if (!/^[\u0600-\u06FFa-z0-9_-]{1,20}$/.test(alias)) {
        return interaction.reply({ content: 'الاختصار غير صالح (1-20 حرف).', ephemeral: false });
      }

      commandShortcuts[alias] = command;
      interaction.client.db.upsert('guildConfigs', { guildId: interaction.guildId }, { ...cfg, commandShortcuts });
      return interaction.reply({ content: `تم حفظ الاختصار: \`${alias}\` ← \`${command}\``, ephemeral: false });
    }

    if (interaction.customId === 'shortcut:remove-modal') {
      const alias = interaction.fields.getTextInputValue('alias').trim().toLowerCase();
      if (!commandShortcuts[alias]) {
        return interaction.reply({ content: 'الاختصار غير موجود.', ephemeral: false });
      }
      delete commandShortcuts[alias];
      interaction.client.db.upsert('guildConfigs', { guildId: interaction.guildId }, { ...cfg, commandShortcuts });
      return interaction.reply({ content: `تم حذف الاختصار: \`${alias}\``, ephemeral: false });
    }
  }
};
