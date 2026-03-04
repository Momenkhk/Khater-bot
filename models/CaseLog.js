const { Schema, model } = require('mongoose');

const caseLogSchema = new Schema({
  guildId: { type: String, index: true },
  caseId: { type: Number, index: true },
  action: String,
  targetId: String,
  moderatorId: String,
  reason: String,
  evidenceUrl: String,
  metadata: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = model('CaseLog', caseLogSchema);
