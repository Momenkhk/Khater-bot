const { SlashCommandBuilder } = require('discord.js');
const AutoResponse = require('../../models/AutoResponse');

module.exports = {
  name: 'autoresponse',
  cooldown: 2000,
  slashData: new SlashCommandBuilder()
    .setName('autoresponse')
    .setDescription('Create an auto response')
    .addStringOption((o) => o.setName('trigger').setDescription('Trigger').setRequired(true))
    .addStringOption((o) => o.setName('response').setDescription('Response').setRequired(true)),
  async execute({ interaction, message, args, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const trigger = interaction?.options?.getString('trigger') || args[0];
    const response = interaction?.options?.getString('response') || args.slice(1).join(' ');

    await AutoResponse.create({ guildId, trigger, response });
    const text = `Auto response created for: ${trigger}`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: true });
    return message.reply(text);
  }
};
