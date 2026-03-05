const store = require('../database/fileStore');

function getSecurity(guildId) {
  return store.get('security', guildId);
}

function updateSecurity(guildId, patch) {
  return store.update('security', guildId, patch);
}

function isWhitelisted(guildId, userId) {
  const wl = store.get('whitelist', guildId);
  return Array.isArray(wl.users) && wl.users.includes(userId);
}

function logSecurity(guildId, payload) {
  const logs = store.get('logs', guildId);
  const security = logs.security || [];
  security.push({ ...payload, at: Date.now() });
  store.update('logs', guildId, { ...logs, security: security.slice(-500) });
}

module.exports = { getSecurity, updateSecurity, isWhitelisted, logSecurity };
