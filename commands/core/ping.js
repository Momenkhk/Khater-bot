const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  cooldown: 2000,
  slashData: new SlashCommandBuilder().setName('ping').setDescription('Latency check'),
  async execute({ interaction, message, source }) {
    const latency = Date.now() - (interaction?.createdTimestamp || message?.createdTimestamp || Date.now());
    if (source === 'slash') return interaction.reply({ content: `Pong ${latency}ms`, ephemeral: true });
    return message.reply(`Pong ${latency}ms`);
  }
};
