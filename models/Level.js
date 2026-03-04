const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
  guildId: { type: String, index: true },
  userId: { type: String, index: true },
  xp: { type: Number, default: 0 },
  voiceXp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastGainAt: { type: Number, default: 0 }
}, { timestamps: true });

levelSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = model('Level', levelSchema);
