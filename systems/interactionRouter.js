const enforceCooldown = require('../utils/cooldownManager');
const safeReply = require('../utils/safeReply');
const { hasPermission } = require('../utils/permissionManager');

module.exports = function createInteractionRouter(client) {
  return async function interactionRouter(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      const cooldown = enforceCooldown(client, `${interaction.user.id}:${command.name}`, command.cooldown || 2000);
      if (cooldown) return safeReply(interaction, { content: `Cooldown active: ${cooldown}s`, ephemeral: true });

      if (command.permissions && !hasPermission(interaction.member, command.permissions)) {
        return safeReply(interaction, { content: 'Insufficient permissions.', ephemeral: true });
      }

      try {
        await command.execute({ client, interaction, source: 'slash' });
      } catch (error) {
        console.error('[SLASH_COMMAND_ERROR]', error);
        await safeReply(interaction, { content: 'Command execution failed.', ephemeral: true });
      }
    }
  };
};
