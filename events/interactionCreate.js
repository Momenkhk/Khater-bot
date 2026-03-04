const ticketSystem = require('../systems/ticketSystem');
const shortcutSystem = require('../systems/shortcutSystem');
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === 'ticket:create') return ticketSystem.createTicket(interaction);
      if (interaction.customId === 'ticket:claim') return ticketSystem.claimTicket(interaction);
      if (interaction.customId === 'ticket:close') return ticketSystem.closeTicket(interaction);

      if (interaction.customId.startsWith('shortcut:')) return shortcutSystem.handleButton(interaction);

      if (interaction.customId === 'security:toggle-mentions') {
        const cfg = client.db.findOne('guildConfigs', { guildId: interaction.guildId }) || {};
        const enabled = !(cfg.security?.mentionsGuard ?? true);
        client.db.upsert('guildConfigs', { guildId: interaction.guildId }, { ...cfg, security: { ...(cfg.security || {}), mentionsGuard: enabled } });
        return interaction.reply({ content: `حماية المنشن: ${enabled ? 'مفعلة' : 'متوقفة'}` });
      }
      if (interaction.customId === 'security:toggle-commands') {
        const cfg = client.db.findOne('guildConfigs', { guildId: interaction.guildId }) || {};
        const enabled = !(cfg.security?.commandGuard ?? true);
        client.db.upsert('guildConfigs', { guildId: interaction.guildId }, { ...cfg, security: { ...(cfg.security || {}), commandGuard: enabled } });
        return interaction.reply({ content: `حماية سبام الأوامر: ${enabled ? 'مفعلة' : 'متوقفة'}` });
      }

      if (interaction.customId === 'autoresponse:add') {
        const modal = new ModalBuilder().setCustomId('autoresponse:add-modal').setTitle('إضافة رد تلقائي');
        modal.addComponents(
          new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('trigger').setLabel('الكلمة/النمط').setRequired(true).setStyle(TextInputStyle.Short)),
          new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('response').setLabel('الرد').setRequired(true).setStyle(TextInputStyle.Paragraph))
        );
        return interaction.showModal(modal);
      }
      if (interaction.customId === 'autoresponse:list') {
        const rows = client.db.find('autoResponses', { guildId: interaction.guildId }).slice(0, 20);
        const text = rows.length ? rows.map((r, i) => `${i + 1}) ${r.trigger} => ${r.response}`).join('\n') : 'لا يوجد ردود تلقائية.';
        return interaction.reply({ content: text });
      }
      if (interaction.customId === 'autoresponse:clear') {
        const n = client.db.deleteMany('autoResponses', { guildId: interaction.guildId });
        return interaction.reply({ content: `تم حذف ${n} رد تلقائي.` });
      }

      if (interaction.customId.startsWith('welcome_ack:')) return interaction.reply({ content: 'تم تأكيد القوانين.' });
      if (interaction.customId.startsWith('roles:toggle:')) return interaction.reply({ content: 'تم تحديث الدور.' });
      if (interaction.customId.startsWith('roles:unique:')) return interaction.reply({ content: 'تم تحديث الدور الفريد.' });
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('shortcut:')) return shortcutSystem.handleModal(interaction);
      if (interaction.customId === 'autoresponse:add-modal') {
        const trigger = interaction.fields.getTextInputValue('trigger');
        const response = interaction.fields.getTextInputValue('response');
        client.db.insert('autoResponses', { guildId: interaction.guildId, trigger, response, isRegex: false, caseSensitive: false, cooldownMs: 3000, enabledChannels: [] });
        return interaction.reply({ content: 'تم إضافة الرد التلقائي بنجاح.' });
      }
    }

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'roles:select') return interaction.reply({ content: `تم الاختيار: ${interaction.values.join(', ') || 'لا شيء'}` });
      if (interaction.customId === 'shortcut:select-command') return interaction.reply({ content: `الأمر المختار: ${interaction.values[0]}` });
    }

    return client.systems.interactionRouter(interaction);
  }
};
