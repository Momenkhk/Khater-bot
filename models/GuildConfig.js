const { Schema, model } = require('mongoose');

const guildConfigSchema = new Schema({
  guildId: { type: String, unique: true, index: true },
  prefix: { type: String, default: '!' },
  permissions: { type: Map, of: String, default: {} },
  moderation: {
    logChannelId: String,
    muteRoleId: String,
    appealChannelId: String,
    thresholds: {
      warns: { type: Number, default: 3 },
      action: { type: String, default: 'timeout' }
    }
  },
  welcome: {
    enabled: { type: Boolean, default: false },
    channelId: String,
    leaveChannelId: String,
    autoRoleIds: [String],
    message: String,
    leaveMessage: String
  },
  automod: {
    enabled: { type: Boolean, default: true },
    antiSpam: { type: Boolean, default: true },
    antiInvite: { type: Boolean, default: true },
    badWords: [String],
    punishment: { type: String, default: 'timeout' }
  },
  leveling: {
    enabled: { type: Boolean, default: true },
    multiplier: { type: Number, default: 1 },
    levelRoles: [{ level: Number, roleId: String }]
  },
  tickets: {
    enabled: { type: Boolean, default: true },
    categoryIds: [String],
    staffRoleIds: [String],
    maxPerUser: { type: Number, default: 2 }
  }
}, { timestamps: true });

module.exports = model('GuildConfig', guildConfigSchema);
