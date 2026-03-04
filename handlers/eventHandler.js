const fs = require('fs');
const path = require('path');

function scan(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return scan(full);
    return entry.name.endsWith('.js') ? [full] : [];
  });
}

function register(client, event) {
  if (!event?.name || typeof event.execute !== 'function') return 0;
  const handler = (...args) => event.execute(client, ...args);

  if (!client._dynamicEventHandlers) client._dynamicEventHandlers = new Map();
  const previous = client._dynamicEventHandlers.get(event.name);
  if (previous?.length) {
    for (const oldHandler of previous) client.off(event.name, oldHandler);
  }

  if (event.once) client.once(event.name, handler);
  else client.on(event.name, handler);

  const current = client._dynamicEventHandlers.get(event.name) || [];
  current.push(handler);
  client._dynamicEventHandlers.set(event.name, current);

  return 1;
}

module.exports = async function loadEvents(client, baseDir) {
  const files = scan(baseDir);
  let count = 0;

  for (const file of files) {
    delete require.cache[require.resolve(file)];
    const loaded = require(file);
    if (Array.isArray(loaded)) {
      for (const event of loaded) count += register(client, event);
    } else {
      count += register(client, loaded);
    }
  }

  console.log(`[EVENT_HANDLER] Loaded ${count} events`);
};
