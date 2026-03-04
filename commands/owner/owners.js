const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'owners',
  category: 'owner',
  cooldown: 1000,
  slashData: new SlashCommandBuilder().setName('owners').setDescription('Show owner list'),
  async execute({ client, interaction, message, source }) {
    const text = `Bot owners: ${client.config.owners.map((x) => `<@${x}>`).join(', ')}`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
