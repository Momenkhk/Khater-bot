const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserLang } = require('../../utils/i18n');

module.exports = {
  name: 'help',
  category: 'general',
  cooldown: 1200,
  slashData: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display command categories and usage')
    .addStringOption((o) => o.setName('lang').setDescription('Language / اللغة').addChoices(
      { name: 'English', value: 'en' },
      { name: 'العربية', value: 'ar' }
    )),
  async execute({ client, interaction, message, source }) {
    const userId = interaction?.user?.id || message?.author?.id;
    const lang = getUserLang(client, userId);

    const grouped = {};
    for (const cmd of client.prefixCommands.values()) {
      const category = cmd.category || 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(cmd.name);
    }

    const embed = new EmbedBuilder().setColor(0x5865f2)
      .setTitle(lang === 'ar' ? 'مركز المساعدة' : 'Help Center')
      .setDescription(lang === 'ar' ? 'الأوامر مقسمة حسب الفئة:' : 'Commands grouped by category:')
      .setFooter({ text: lang === 'ar' ? 'غيّر اللغة: /language أو --ar --en' : 'Change language: /language or --ar --en' });

    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, names]) => {
        embed.addFields({ name: category.toUpperCase(), value: names.sort().map((x) => `\`${x}\``).join(', ').slice(0, 1024) || '-' });
      });

    if (source === 'slash') return interaction.reply({ embeds: [embed], ephemeral: true });
    return message.reply({ embeds: [embed] });
  }
};
