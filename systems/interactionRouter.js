const enforceCooldown = require('../utils/cooldownManager');
const safeReply = require('../utils/safeReply');
const { hasPermission } = require('../utils/permissionManager');
const { t } = require('../utils/i18n');

module.exports = function createInteractionRouter(client) {
  return async function interactionRouter(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const scope = client.systems.security.validateCommandUse(`slash:${interaction.guildId}:${interaction.user.id}:${interaction.commandName}`);
    if (!scope.ok) return safeReply(interaction, { content: scope.reason, ephemeral: true });

    const command = client.slashCommands.get(interaction.commandName.toLowerCase());
    if (!command) return;

    const selectedLang = interaction.options?.getString('lang');
    if (selectedLang && ['ar', 'en'].includes(selectedLang)) {
      client.db.upsert('users', { userId: interaction.user.id }, { lang: selectedLang });
    }

    const cooldown = enforceCooldown(client, `${interaction.user.id}:${command.name}`, command.cooldown || 2000);
    if (cooldown) return safeReply(interaction, { content: t(client, interaction.user.id, 'COOLDOWN', { s: cooldown }), ephemeral: true });

    if (command.permissions && !hasPermission(interaction.member, command.permissions)) {
      return safeReply(interaction, { content: t(client, interaction.user.id, 'INSUFFICIENT_PERM'), ephemeral: true });
    }

    try {
      await command.execute({ client, interaction, source: 'slash' });
    } catch (error) {
      console.error('[SLASH_COMMAND_ERROR]', error);
      await safeReply(interaction, { content: t(client, interaction.user.id, 'COMMAND_FAILED'), ephemeral: true });
    }
  };
};
