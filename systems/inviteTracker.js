const Invite = require('../models/Invite');

module.exports = {
  async snapshot(guild) {
    const invites = await guild.invites.fetch();
    for (const invite of invites.values()) {
      await Invite.findOneAndUpdate(
        { guildId: guild.id, code: invite.code },
        { inviterId: invite.inviterId, uses: invite.uses },
        { upsert: true }
      );
    }
  }
};
