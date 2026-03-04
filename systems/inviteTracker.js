module.exports = {
  async snapshot(guild) {
    const invites = await guild.invites.fetch();
    for (const invite of invites.values()) {
      guild.client.db.upsert(
        'invites',
        { guildId: guild.id, code: invite.code },
        { inviterId: invite.inviterId, uses: invite.uses, fake: false }
      );
    }
  }
};
