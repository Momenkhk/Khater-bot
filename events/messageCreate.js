const autoModSystem = require('../systems/autoModSystem');
const levelSystem = require('../systems/levelSystem');
const autoResponseSystem = require('../systems/autoResponseSystem');

module.exports = {
  name: 'messageCreate',
  async execute(client, message) {
    await autoModSystem(message);
    await autoResponseSystem(message);
    await levelSystem.onMessage(message);
    await client.systems.prefixRouter(message);
  }
};
