const fs = require('fs');
const path = require('path');

const dbDir = path.join(process.cwd(), 'database');
const files = ['settings', 'whitelist', 'logs', 'panels', 'tickets', 'security'];

function ensure() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  for (const name of files) {
    const file = path.join(dbDir, `${name}.json`);
    if (!fs.existsSync(file)) fs.writeFileSync(file, '{}');
  }
}

function read(name) {
  ensure();
  const file = path.join(dbDir, `${name}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8') || '{}');
}

function write(name, payload) {
  ensure();
  const file = path.join(dbDir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
}

function guildKey(guildId) {
  return String(guildId);
}

module.exports = {
  ensure,
  get(name, guildId) {
    const all = read(name);
    return all[guildKey(guildId)] || {};
  },
  set(name, guildId, data) {
    const all = read(name);
    all[guildKey(guildId)] = data;
    write(name, all);
    return data;
  },
  update(name, guildId, patch) {
    const current = this.get(name, guildId);
    const next = { ...current, ...patch };
    return this.set(name, guildId, next);
  },
  readAll: read,
  writeAll: write
};
