const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = function createSimpleCommand({
  name,
  description,
  permissions = [PermissionFlagsBits.ModerateMembers],
  run
}) {
  return {
    name,
    description,
    permissions,
    cooldown: 3000,
    slashData: new SlashCommandBuilder().setName(name).setDescription(description),
    async execute(ctx) {
      return run(ctx);
    }
  };
};
