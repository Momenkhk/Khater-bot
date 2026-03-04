const { Schema, model } = require('mongoose');

const inviteSchema = new Schema({
  guildId: { type: String, index: true },
  code: String,
  inviterId: String,
  uses: { type: Number, default: 0 },
  fake: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = model('Invite', inviteSchema);
