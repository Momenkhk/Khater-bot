const logEvent = require('../systems/loggingSystem');

module.exports = [
  { name: 'roleCreate', execute: async (client, role) => logEvent(role.guild, 'Role Create', `${role.name}`) },
  { name: 'roleDelete', execute: async (client, role) => logEvent(role.guild, 'Role Delete', `${role.name}`) },
  { name: 'roleUpdate', execute: async (client, oldRole, newRole) => logEvent(newRole.guild, 'Role Update', `${oldRole.name} -> ${newRole.name}`) }
];
