const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'stats',
  category: 'owner',
  cooldown: 1000,
  slashData: new SlashCommandBuilder().setName('stats').setDescription('Bot runtime stats (owner only)'),
  async execute({ client, interaction, message, source }) {
    const userId = interaction?.user?.id || message.author.id;
    if (!client.config.owners.includes(userId)) {
      const txt = 'Owner only command.';
      return source === 'slash' ? interaction.reply({ content: txt, ephemeral: false }) : message.reply(txt);
    }

    const txt = `Guilds: ${client.guilds.cache.size}\nUsers(cached): ${client.users.cache.size}\nUptime: ${Math.floor(process.uptime())}s\nMemory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`;
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: false });
    return message.reply(txt);
  }
};
