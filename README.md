# Khater Bot (Discord.js v14)

بوت ديسكورد Modular متقدم مع تخزين **JSON** كامل، ودعم عربي/إنجليزي.

## أهم الميزات
- Slash + Prefix commands مع Dynamic loader + Hot reload.
- تخزين JSON كامل بدون MongoDB.
- نظام لغات لكل مستخدم (`/language` + `--ar` `--en`).
- أوامر عامة + إدارة + أونر.
- أنظمة: AutoMod, AutoResponse, Leveling, Tickets, Logging, Protection.
- Security layer قوية: rate limits, mention guard, command abuse guard, permission validation.
- لوحة اختصارات أوامر `/commands-shortcut` لإدارة aliases بسهولة من بانل.

## أمثلة أوامر
- **General**: `help`, `ping`, `avatar`, `userinfo`, `serverinfo`, `profile`
- **Admin**: `commands-shortcut`, `warn`, `warnings`, `clearwarns`, `clear`, `slowmode`, `lock`, `unlock`, `kick`, `ban`, `unban`, `setprefix`
- **Owner**: `reload`, `stats`, `owners`

## التشغيل
1. عدّل `config.json` أو استخدم `BOT_TOKEN`.
2. `npm install`
3. `npm run start` أو `npm run shard`
