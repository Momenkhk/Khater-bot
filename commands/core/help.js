const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  category: 'general',
  cooldown: 1200,
  slashData: new SlashCommandBuilder().setName('help').setDescription('عرض كل الأوامر حسب التصنيف'),
  async execute({ client, interaction, message, source }) {
    const grouped = {};
    for (const cmd of client.prefixCommands.values()) {
      const category = cmd.category || 'عام';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(cmd.name);
    }

    const embed = new EmbedBuilder().setColor(0x5865f2)
      .setTitle('مركز المساعدة')
      .setDescription('قائمة الأوامر الكاملة حسب الفئات')
      .setFooter({ text: `إجمالي الأوامر: ${client.prefixCommands.size}` });

    Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).forEach(([category, names]) => {
      embed.addFields({ name: category.toUpperCase(), value: names.sort().map((x) => `\`${x}\``).join(' ، ').slice(0, 1024) || '-' });
    });

    if (source === 'slash') return interaction.reply({ embeds: [embed] });
    return message.reply({ embeds: [embed] });
  }
};
