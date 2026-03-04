module.exports = {
  ban: {
    description: 'حظر عضو من السيرفر.',
    aliases: ['حظر', 'باند', 'ban_user'],
    usage: ['/ban user:@member reason:سبب', '$ban @member سبب'],
    examples: ['/ban user:@spammer reason:spam', '$ban @spammer سبام']
  },
  kick: {
    description: 'طرد عضو من السيرفر.',
    aliases: ['طرد', 'kick_user'],
    usage: ['/kick user:@member reason:سبب', '$kick @member سبب'],
    examples: ['/kick user:@member reason:مخالفة', '$kick @member مخالفة']
  },
  mute: {
    description: 'كتم عضو.',
    aliases: ['كتم', 'mutetext'],
    usage: ['$mute @member'],
    examples: ['$mute @member']
  },
  unmute: {
    description: 'فك كتم عضو.',
    aliases: ['فك_كتم', 'unmutetext'],
    usage: ['$unmute @member'],
    examples: ['$unmute @member']
  },
  warn: {
    description: 'إعطاء تحذير لعضو.',
    aliases: ['تحذير', 'warn_user'],
    usage: ['/warn user:@member reason:سبب', '$warn @member سبب'],
    examples: ['/warn user:@member reason:إزعاج', '$warn @member إزعاج']
  },
  clear: {
    description: 'حذف رسائل من القناة.',
    aliases: ['مسح', 'تنظيف'],
    usage: ['/clear amount:10', '$clear 10'],
    examples: ['/clear amount:50', '$clear 50']
  },
  lock: {
    description: 'قفل القناة الحالية.',
    aliases: ['قفل'],
    usage: ['/lock', '$lock'],
    examples: ['$lock']
  },
  unlock: {
    description: 'فتح القناة الحالية.',
    aliases: ['فتح_القناة'],
    usage: ['/unlock', '$unlock'],
    examples: ['$unlock']
  }
};
