const logEvent = require('../systems/loggingSystem');

module.exports = [
  { name: 'channelCreate', execute: async (client, channel) => logEvent(channel.guild, 'Channel Create', `${channel.name} (${channel.id})`) },
  { name: 'channelDelete', execute: async (client, channel) => logEvent(channel.guild, 'Channel Delete', `${channel.name} (${channel.id})`) },
  { name: 'channelUpdate', execute: async (client, oldCh, newCh) => logEvent(newCh.guild, 'Channel Update', `${oldCh.name} -> ${newCh.name}`) }
];
