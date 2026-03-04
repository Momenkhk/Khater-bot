const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
  guildId: { type: String, index: true },
  channelId: { type: String, unique: true },
  userId: String,
  claimedBy: String,
  status: { type: String, default: 'open' },
  category: String,
  transcriptUrl: String
}, { timestamps: true });

module.exports = model('Ticket', ticketSchema);
