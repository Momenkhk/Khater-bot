const { Schema, model } = require('mongoose');

const autoResponseSchema = new Schema({
  guildId: { type: String, index: true },
  trigger: String,
  isRegex: { type: Boolean, default: false },
  caseSensitive: { type: Boolean, default: false },
  response: String,
  enabledChannels: [String],
  cooldownMs: { type: Number, default: 3000 }
}, { timestamps: true });

module.exports = model('AutoResponse', autoResponseSchema);
