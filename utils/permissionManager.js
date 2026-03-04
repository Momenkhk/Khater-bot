const { PermissionFlagsBits } = require('discord.js');

const defaultHierarchy = {
  owner: [PermissionFlagsBits.Administrator],
  admin: [PermissionFlagsBits.ManageGuild],
  mod: [PermissionFlagsBits.ModerateMembers],
  helper: [PermissionFlagsBits.ManageMessages]
};

function hasPermission(member, required = []) {
  return required.every((perm) => member.permissions.has(perm));
}

module.exports = { defaultHierarchy, hasPermission };
