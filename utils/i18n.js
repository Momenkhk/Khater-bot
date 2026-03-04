const dict = {
  en: {
    COMMAND_FAILED: 'Command execution failed.',
    COOLDOWN: 'Cooldown active: {s}s',
    OWNER_ONLY: 'Owner only command.',
    LANG_SET: 'Language changed to English.',
    LANG_PROMPT: 'Choose your language / اختر لغتك',
    INSUFFICIENT_PERM: 'Insufficient permissions.',
    PING: 'Pong {ms}ms',
    HELP: 'Available modules loaded: {count}'
  },
  ar: {
    COMMAND_FAILED: 'حدث خطأ أثناء تنفيذ الأمر.',
    COOLDOWN: 'انتظر: {s} ثانية',
    OWNER_ONLY: 'هذا الأمر للمالك فقط.',
    LANG_SET: 'تم تغيير اللغة إلى العربية.',
    LANG_PROMPT: 'اختر لغتك / Choose your language',
    INSUFFICIENT_PERM: 'ليس لديك صلاحيات كافية.',
    PING: 'بونج {ms}ms',
    HELP: 'الوحدات المتاحة: {count}'
  }
};

function getUserLang(client, userId) {
  return client.db.findOne('users', { userId })?.lang || 'en';
}

function t(client, userId, key, vars = {}) {
  const lang = getUserLang(client, userId);
  const template = dict[lang]?.[key] || dict.en[key] || key;
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), template);
}

module.exports = { t, getUserLang };
