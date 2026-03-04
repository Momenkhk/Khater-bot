const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

function scan(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return scan(full);
    return entry.name.endsWith('.js') ? [full] : [];
  });
}

module.exports = async function loadCommands(client, baseDir) {
  client.prefixCommands.clear();
  client.slashCommands.clear();

  const files = scan(baseDir);
  const slashPayload = [];

  for (const file of files) {
    delete require.cache[require.resolve(file)];
    const command = require(file);
    if (!command?.name || typeof command.execute !== 'function') continue;

    const normalizedName = command.name.toLowerCase();
    if (command.prefix !== false) client.prefixCommands.set(normalizedName, command);
    if (command.slashData) {
      client.slashCommands.set(normalizedName, command);
      slashPayload.push(command.slashData.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN || client.config.token);
  await rest.put(Routes.applicationCommands(client.config.clientId), { body: slashPayload });

  console.log(`[COMMAND_HANDLER] Loaded ${client.prefixCommands.size} prefix and ${client.slashCommands.size} slash commands`);
};
