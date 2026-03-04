# بوت Khater (Discord.js v14)

بوت ديسكورد متطور بهيكل Modular وتخزين JSON كامل، مع لوحة اختصارات وبنلات إدارة متقدمة.

## الميزات
- أوامر Slash + Prefix مع تحميل ديناميكي.
- اختصارات أوامر بدون بريفكس (مثل: `باند` بدل `!ban`) عبر `/commands-shortcut`.
- تكت بيلدر متطور: فتح/استلام/إغلاق من نفس البنل.
- بنل حماية `/security-panel` لإدارة حماية المنشن وسبام الأوامر.
- بنل ردود تلقائية `/autoresponse-panel` لإضافة/عرض/حذف الردود.
- نظام أمان قوي: Rate limit + حماية من الإساءة + صلاحيات دقيقة.
- كل التخزين JSON بدون MongoDB.

## أوامر مهمة
- **عام**: `help`, `ping`, `avatar`, `userinfo`, `serverinfo`, `profile`
- **إدارة**: `commands-shortcut`, `ticket-builder`, `ticketpanel`, `security-panel`, `autoresponse-panel`, `warn`, `warnings`, `clearwarns`, `clear`, `slowmode`, `lock`, `unlock`, `kick`, `ban`, `unban`, `setprefix`
- **أونر**: `reload`, `stats`, `owners`

## تشغيل
1. عدّل `config.json` أو ضع `BOT_TOKEN`.
2. `npm install`
3. `npm run start` أو `npm run shard`
