const logger = require('../utils/logger');

module.exports = function createAntiCrash(client) {
  process.on('unhandledRejection', (error) => logger.error('UnhandledRejection', error));
  process.on('uncaughtException', (error) => logger.error('UncaughtException', error));
  process.on('uncaughtExceptionMonitor', (error) => logger.warn('UncaughtExceptionMonitor', error));

  client.on('error', (error) => logger.error('ClientError', error));
  client.on('shardError', (error) => logger.error('ShardError', error));
};
