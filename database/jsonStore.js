const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'json');
const caches = new Map();

function ensureDir() {
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
}

function filePath(collection) {
  ensureDir();
  return path.join(baseDir, `${collection}.json`);
}

function load(collection) {
  if (caches.has(collection)) return caches.get(collection);
  const file = filePath(collection);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]');
  }
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  caches.set(collection, parsed);
  return parsed;
}

function save(collection) {
  const file = filePath(collection);
  fs.writeFileSync(file, JSON.stringify(load(collection), null, 2));
}

function match(item, query = {}) {
  return Object.entries(query).every(([k, v]) => item[k] === v);
}

module.exports = {
  init() {
    ensureDir();
    ['guildConfigs', 'warnings', 'levels', 'autoResponses', 'tickets', 'invites', 'protection', 'users', 'caseLogs'].forEach((c) => load(c));
  },
  find(collection, query = {}) {
    return load(collection).filter((x) => match(x, query));
  },
  findOne(collection, query = {}) {
    return load(collection).find((x) => match(x, query)) || null;
  },
  upsert(collection, query, payload) {
    const arr = load(collection);
    const index = arr.findIndex((x) => match(x, query));
    if (index === -1) {
      arr.push({ ...query, ...payload, createdAt: Date.now(), updatedAt: Date.now() });
      save(collection);
      return arr[arr.length - 1];
    }
    arr[index] = { ...arr[index], ...payload, updatedAt: Date.now() };
    save(collection);
    return arr[index];
  },
  insert(collection, payload) {
    const arr = load(collection);
    arr.push({ ...payload, id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, createdAt: Date.now(), updatedAt: Date.now() });
    save(collection);
    return arr[arr.length - 1];
  },
  deleteMany(collection, query = {}) {
    const arr = load(collection);
    const next = arr.filter((x) => !match(x, query));
    caches.set(collection, next);
    save(collection);
    return arr.length - next.length;
  }
};
