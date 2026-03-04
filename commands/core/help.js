const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const docs = require('../../utils/commandDocs');

function buildCommandEmbed(commandName, command) {
  const d = docs[commandName] || {
    description: command?.description || 'لا يوجد وصف متاح.',
    aliases: command?.aliases || [],
    usage: [`$${commandName}`],
    examples: [`$${commandName}`]
  };

  return new EmbedBuilder()
    .setColor(0x4f7cff)
    .setTitle(`Command: ${commandName}`)
    .setDescription(d.description)
    .addFields(
      { name: 'الاختصارات', value: d.aliases.length ? d.aliases.map((x) => `\`${x}\``).join('، ') : 'لا يوجد' },
      { name: 'الاستخدام', value: d.usage.join('\n').slice(0, 1024) },
      { name: 'أمثلة', value: d.examples.join('\n').slice(0, 1024) }
    );
}

module.exports = {
  name: 'help',
  category: 'general',
  cooldown: 1200,
  aliases: ['مساعدة', 'اوامر'],
  description: 'عرض المساعدة أو شرح أمر محدد.',
  slashData: new SlashCommandBuilder()
    .setName('help')
    .setDescription('عرض المساعدة أو شرح أمر')
    .addStringOption((o) => o.setName('command').setDescription('اسم الأمر').setRequired(false)),
  async execute({ client, interaction, message, source, args = [] }) {
    const requested = (interaction?.options?.getString('command') || args[0] || '').toLowerCase();

    if (requested) {
      const cmd = client.prefixCommands.get(requested);
      if (!cmd) {
        const txt = 'الأمر غير موجود.';
        return source === 'slash' ? interaction.reply({ content: txt }) : message.reply(txt);
      }
      const embed = buildCommandEmbed(requested, cmd);
      return source === 'slash' ? interaction.reply({ embeds: [embed] }) : message.reply({ embeds: [embed] });
    }

    const grouped = {};
    for (const cmd of client.prefixCommands.values()) {
      const category = cmd.category || 'عام';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(cmd.name);
    }

    const embed = new EmbedBuilder().setColor(0x5865f2)
      .setTitle('مركز المساعدة')
      .setDescription('اكتب `$help <command>` لعرض شرح تفصيلي بالأختصارات والاستخدام.')
      .setFooter({ text: `إجمالي الأوامر: ${client.prefixCommands.size}` });

    Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).forEach(([category, names]) => {
      embed.addFields({ name: category.toUpperCase(), value: names.sort().map((x) => `\`${x}\``).join(' ، ').slice(0, 1024) || '-' });
    });

    if (source === 'slash') return interaction.reply({ embeds: [embed] });
    return message.reply({ embeds: [embed] });
  }
};
