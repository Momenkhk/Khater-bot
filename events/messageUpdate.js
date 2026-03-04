const logEvent = require('../systems/loggingSystem');
module.exports = { name: 'messageUpdate', async execute(client, oldMessage, newMessage) { if (newMessage.guild && oldMessage.content !== newMessage.content) await logEvent(newMessage.guild, 'Message Edit', `Before: ${oldMessage.content || 'N/A'}\nAfter: ${newMessage.content || 'N/A'}`); } };
