const logEvent = require('../systems/loggingSystem');
module.exports = { name: 'messageDeleteBulk', async execute(client, collection) { const guild = collection.first()?.guild; if (guild) await logEvent(guild, 'Bulk Message Delete', `Deleted ${collection.size} messages.`); } };
