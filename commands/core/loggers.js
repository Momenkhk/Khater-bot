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
    const category = await guild.channels.create({ name: 'Security Logs', type: ChannelType.GuildCategory });
    const names = ['join-leave-logs', 'message-logs', 'moderation-logs', 'security-logs', 'role-logs', 'channel-logs', 'voice-logs'];
    const created = {};
    for (const name of names) {
      const ch = await guild.channels.create({ name, type: ChannelType.GuildText, parent: category.id });
      created[name] = ch.id;
    }

    const current = store.get('logs', guild.id);
    store.set('logs', guild.id, { ...current, channels: created, categoryId: category.id });

    const txt = 'تم إنشاء رومات اللوج وضبطها تلقائياً.';
    if (source === 'slash') return interaction.reply({ content: txt });
    return message.reply(txt);
  }
};
