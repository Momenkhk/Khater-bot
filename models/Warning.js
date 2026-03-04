const { Schema, model } = require('mongoose');

const warningSchema = new Schema({
  guildId: { type: String, index: true },
  userId: { type: String, index: true },
  moderatorId: String,
  reason: String,
  evidenceUrl: String,
  notes: String,
  expiresAt: Date,
  caseId: { type: Number, index: true }
}, { timestamps: true });

module.exports = model('Warning', warningSchema);
