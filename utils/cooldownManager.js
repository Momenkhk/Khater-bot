module.exports = function enforceCooldown(client, key, cooldownMs) {
  const now = Date.now();
  const expiresAt = client.cooldowns.get(key);
  if (expiresAt && expiresAt > now) {
    return Math.ceil((expiresAt - now) / 1000);
  }
  client.cooldowns.set(key, now + cooldownMs);
  return null;
};
