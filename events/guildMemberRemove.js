const welcomeSystem = require('../systems/welcomeSystem');
const logEvent = require('../systems/loggingSystem');

module.exports = {
  name: 'guildMemberRemove',
  async execute(client, member) {
    await welcomeSystem.onLeave(member);
    await logEvent(member.guild, 'Member Leave', `${member.user.tag} left.`);
  }
};
