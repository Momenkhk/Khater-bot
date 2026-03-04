const GuildConfig = require('../models/GuildConfig');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  async onJoin(member) {
    const cfg = await GuildConfig.findOne({ guildId: member.guild.id }).lean();
    if (!cfg?.welcome?.enabled || !cfg.welcome.channelId) return;

    const channel = member.guild.channels.cache.get(cfg.welcome.channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('Welcome')
      .setDescription((cfg.welcome.message || 'Welcome {user}').replace('{user}', `<@${member.id}>`))
      .setThumbnail(member.user.displayAvatarURL());

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`welcome_ack:${member.id}`).setLabel('Acknowledge Rules').setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });

    if (cfg.welcome.autoRoleIds?.length) {
      await member.roles.add(cfg.welcome.autoRoleIds).catch(() => null);
    }
  },
  async onLeave(member) {
    const cfg = await GuildConfig.findOne({ guildId: member.guild.id }).lean();
    if (!cfg?.welcome?.leaveChannelId) return;

    const channel = member.guild.channels.cache.get(cfg.welcome.leaveChannelId);
    if (channel) await channel.send((cfg.welcome.leaveMessage || '{user} left the server').replace('{user}', member.user.tag));
  }
};
