const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  category: 'general',
  cooldown: 1000,
  slashData: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show user info')
    .addUserOption((o) => o.setName('user').setDescription('Target user')),
  async execute({ interaction, message, source }) {
    const guild = interaction?.guild || message.guild;
    const user = interaction?.options?.getUser('user') || message?.mentions?.users?.first() || interaction?.user || message.author;
    const member = await guild.members.fetch(user.id).catch(() => null);
    const txt = `User: ${user.tag}\nID: ${user.id}\nCreated: <t:${Math.floor(user.createdTimestamp / 1000)}:R>\nJoined: ${member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A'}`;
    if (source === 'slash') return interaction.reply({ content: txt, ephemeral: true });
    return message.reply(txt);
  }
};
