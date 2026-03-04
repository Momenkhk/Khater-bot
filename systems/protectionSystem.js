const ProtectionState = require('../models/ProtectionState');

module.exports = {
  async checkJoin(member) {
    const now = Date.now();
    const state = await ProtectionState.findOneAndUpdate(
      { guildId: member.guild.id },
      { $setOnInsert: { recentJoins: [] } },
      { upsert: true, new: true }
    );

    state.recentJoins = [...(state.recentJoins || []).filter((time) => now - time < 10000), now];
    if (state.recentJoins.length >= 12) {
      state.raidMode = true;
      state.lockdownUntil = new Date(now + 10 * 60 * 1000);
    }

    await state.save();
  }
};
