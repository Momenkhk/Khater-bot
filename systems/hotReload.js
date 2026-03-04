const chokidar = require('chokidar');
const loadCommands = require('../handlers/commandHandler');

module.exports = function createHotReloader(client, commandPath) {
  const watcher = chokidar.watch(commandPath, { ignoreInitial: true });

  const reload = async () => {
    try {
      await loadCommands(client, commandPath);
      console.log('[HOT_RELOAD] Commands reloaded');
    } catch (error) {
      console.error('[HOT_RELOAD_ERROR]', error);
    }
  };

  watcher.on('add', reload).on('change', reload).on('unlink', reload);
  return watcher;
};
