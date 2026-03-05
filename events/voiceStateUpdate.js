const logEvent = require('../systems/loggingSystem');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(client, oldState, newState) {
    if (!oldState.channelId && newState.channelId) {
      await logEvent(newState.guild, 'Voice Join', `<@${newState.id}> joined ${newState.channel?.name}`);
    } else if (oldState.channelId && !newState.channelId) {
      await logEvent(newState.guild, 'Voice Leave', `<@${newState.id}> left ${oldState.channel?.name}`);
    } else if (oldState.channelId !== newState.channelId) {
      await logEvent(newState.guild, 'Voice Move', `<@${newState.id}> moved ${oldState.channel?.name} -> ${newState.channel?.name}`);
    }
  }
};
