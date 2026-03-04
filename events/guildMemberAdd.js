const welcomeSystem = require('../systems/welcomeSystem');
const protectionSystem = require('../systems/protectionSystem');
const logEvent = require('../systems/loggingSystem');

module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    await protectionSystem.checkJoin(member);
    await welcomeSystem.onJoin(member);
    await logEvent(member.guild, 'Member Join', `${member.user.tag} joined.`);
  }
};
