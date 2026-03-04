const dict = {
  ar: {
    COMMAND_FAILED: 'حدث خطأ أثناء تنفيذ الأمر.',
    COOLDOWN: 'الرجاء الانتظار {s} ثانية قبل إعادة الاستخدام.',
    OWNER_ONLY: 'هذا الأمر مخصص لمالك البوت فقط.',
    INSUFFICIENT_PERM: 'ليس لديك صلاحيات كافية.',
    PING: 'بونج {ms}ms',
    HELP: 'عدد الوحدات المحملة: {count}'
  }
};

function getUserLang() {
  return 'ar';
}

function t(client, userId, key, vars = {}) {
  const template = dict.ar[key] || key;
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), template);
}

module.exports = { t, getUserLang };
