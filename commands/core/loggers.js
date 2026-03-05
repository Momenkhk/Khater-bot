const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const store = require('../../src/database/fileStore');

module.exports = {
  name: 'loggers',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('loggers').setDescription('إنشاء رومات اللوج تلقائياً'),
  async execute({ interaction, message, source }) {
    const guild = interaction?.guild || message.guild;

    try {
      if (source === 'slash' && !interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: false });
      }

      const me = guild.members.me || (await guild.members.fetchMe());
      const requiredPerms = [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel];
      if (!me.permissions.has(requiredPerms)) {
        const txt = 'لا أمتلك صلاحية إدارة القنوات. تأكد من إعطاء البوت Manage Channels.';
        if (source === 'slash') return interaction.editReply({ content: txt });
        return message.reply(txt);
      }

      const names = ['join-leave-logs', 'message-logs', 'moderation-logs', 'security-logs', 'role-logs', 'channel-logs', 'voice-logs'];
      const existing = guild.channels.cache;
      let category = existing.find((c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === 'security logs');
      if (!category) {
        category = await guild.channels.create({ name: 'Security Logs', type: ChannelType.GuildCategory });
      }

      const created = {};
      for (const name of names) {
        let ch = existing.find((c) => c.type === ChannelType.GuildText && c.name === name);
        if (!ch) {
          ch = await guild.channels.create({ name, type: ChannelType.GuildText, parent: category.id });
        } else if (ch.parentId !== category.id) {
          await ch.setParent(category.id).catch(() => null);
        }
        created[name] = ch.id;
      }

      const current = store.get('logs', guild.id);
      store.set('logs', guild.id, { ...current, channels: created, categoryId: category.id });

      const txt = '✅ تم إنشاء/تحديث رومات اللوج وضبطها تلقائياً.';
      if (source === 'slash') return interaction.editReply({ content: txt });
      return message.reply(txt);
    } catch (error) {
      console.error('[LOGGERS_COMMAND_ERROR]', error);
      const txt = 'حدث خطأ أثناء إنشاء رومات اللوج. راجع صلاحيات البوت وحاول مرة أخرى.';
      if (source === 'slash') {
        if (interaction.deferred || interaction.replied) return interaction.editReply({ content: txt });
        return interaction.reply({ content: txt, ephemeral: false });
      }
      return message.reply(txt);
    }
  }
};
