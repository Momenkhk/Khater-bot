const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'setprefix',
  permissions: [PermissionFlagsBits.ManageGuild],
  cooldown: 2000,
  slashData: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Set server prefix')
    .addStringOption((o) => o.setName('prefix').setDescription('New prefix').setRequired(true)),
  async execute({ client, interaction, message, args, source }) {
    const guildId = interaction?.guildId || message.guild.id;
    const prefix = interaction?.options?.getString('prefix') || args[0];
    client.db.upsert('guildConfigs', { guildId }, { prefix });
    const text = `Prefix updated to: ${prefix}`;
    if (source === 'slash') return interaction.reply({ content: text, ephemeral: false });
    return message.reply(text);
  }
};
