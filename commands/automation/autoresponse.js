const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'autoresponse',
  category: 'admin',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 2000,
  slashData: new SlashCommandBuilder()
    .setName('autoresponse')
    .setDescription('إضافة رد تلقائي')
    .addStringOption((o) => o.setName('trigger').setDescription('الكلمة المحفزة').setRequired(true))
    .addStringOption((o) => o.setName('response').setDescription('نص الرد').setRequired(true))
    .addBooleanOption((o) => o.setName('regex').setDescription('نمط regex')),
  async execute({ interaction, message, args, source, client }) {
    const guildId = interaction?.guildId || message.guild.id;
    const trigger = interaction?.options?.getString('trigger') || args[0];
    const response = interaction?.options?.getString('response') || args.slice(1).join(' ');
    const isRegex = interaction?.options?.getBoolean('regex') || false;

    client.db.insert('autoResponses', { guildId, trigger, response, isRegex, caseSensitive: false, enabledChannels: [], cooldownMs: 3000 });
    const text = `تم إنشاء رد تلقائي للكلمة: ${trigger}`;
    if (source === 'slash') return interaction.reply({ content: text });
    return message.reply(text);
  }
};
