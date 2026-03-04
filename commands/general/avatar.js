const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  category: 'general',
  cooldown: 1000,
  slashData: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show user avatar')
    .addUserOption((o) => o.setName('user').setDescription('Target user')),
  async execute({ interaction, message, source }) {
    const user = interaction?.options?.getUser('user') || message?.mentions?.users?.first() || interaction?.user || message.author;
    const txt = user.displayAvatarURL({ size: 1024, extension: 'png' });
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: true });
    return message.reply(txt);
  }
};
