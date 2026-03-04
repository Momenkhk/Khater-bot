module.exports = {
  async checkJoin(member) {
    const now = Date.now();
    const state = member.client.db.findOne('protection', { guildId: member.guild.id }) || {
      guildId: member.guild.id,
      raidMode: false,
      recentJoins: []
    };

    state.recentJoins = [...(state.recentJoins || []).filter((time) => now - time < 10000), now];
    if (state.recentJoins.length >= 12) {
      state.raidMode = true;
      state.lockdownUntil = now + 10 * 60 * 1000;
    }

    member.client.db.upsert('protection', { guildId: member.guild.id }, state);
  }
};
