const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const store = require('../../src/database/fileStore');

module.exports = {
  name: 'whitelist',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 1500,
  slashData: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('إدارة القائمة البيضاء')
    .addSubcommand((s) => s.setName('add').setDescription('إضافة عضو').addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(true)))
    .addSubcommand((s) => s.setName('remove').setDescription('حذف عضو').addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(true)))
    .addSubcommand((s) => s.setName('list').setDescription('عرض القائمة')),
  async execute({ interaction, message, args, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const data = store.get('whitelist', guildId);
    const users = Array.isArray(data.users) ? data.users : [];

    if (source === 'slash') {
      const sub = interaction.options.getSubcommand();
      if (sub === 'add') {
        const id = interaction.options.getUser('user').id;
        if (!users.includes(id)) users.push(id);
        store.set('whitelist', guildId, { users });
        return interaction.reply({ content: `تم إضافة <@${id}> إلى القائمة البيضاء.` });
      }
      if (sub === 'remove') {
        const id = interaction.options.getUser('user').id;
        store.set('whitelist', guildId, { users: users.filter((x) => x !== id) });
        return interaction.reply({ content: `تم حذف <@${id}> من القائمة البيضاء.` });
      }
      return interaction.reply({ content: users.length ? users.map((x) => `<@${x}>`).join('\n') : 'القائمة البيضاء فارغة.' });
    }

    const sub = (args[0] || '').toLowerCase();
    const id = message.mentions.users.first()?.id;
    if (sub === 'add' && id) {
      if (!users.includes(id)) users.push(id);
      store.set('whitelist', guildId, { users });
      return message.reply(`تم إضافة <@${id}>.`);
    }
    if (sub === 'remove' && id) {
      store.set('whitelist', guildId, { users: users.filter((x) => x !== id) });
      return message.reply(`تم حذف <@${id}>.`);
    }
    return message.reply(users.length ? users.map((x) => `<@${x}>`).join('\n') : 'القائمة البيضاء فارغة.');
  }
};
