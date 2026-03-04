const logEvent = require('../systems/loggingSystem');
module.exports = { name: 'messageDelete', async execute(client, message) { if (message.guild) await logEvent(message.guild, 'Message Delete', `Author: <@${message.author?.id || 'unknown'}>\n${message.content || 'No content'}`); } };
