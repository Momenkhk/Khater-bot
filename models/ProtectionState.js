const { Schema, model } = require('mongoose');

const protectionStateSchema = new Schema({
  guildId: { type: String, unique: true, index: true },
  raidMode: { type: Boolean, default: false },
  lockdownUntil: Date,
  recentJoins: [Number],
  actionCounters: {
    roleDeletes: { type: Number, default: 0 },
    channelDeletes: { type: Number, default: 0 },
    roleCreates: { type: Number, default: 0 },
    channelCreates: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = model('ProtectionState', protectionStateSchema);
