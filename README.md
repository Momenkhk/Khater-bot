# بوت Khater Security (Discord.js v14 + Express)

بوت حماية متكامل ومنظم مع Dashboard حديث + أوامر مقسمة + تخزين JSON.

## التقنيات
- Node.js
- discord.js v14
- Express.js Dashboard
- JSON Files Storage

## التخزين (JSON)
داخل `/database`:
- settings.json
- whitelist.json
- logs.json
- panels.json
- tickets.json
- security.json

## مميزات الإدارة
- التحكم في حالة كل أمر من الداشبورد (تشغيل/إيقاف).
- التحكم في أنظمة الحماية: Anti Nuke / Beast Mode / Anti Raid / Anti Spam / Verification.
- تحكم كامل في Whitelist و Logs من الداشبورد.
- Command shortcuts بدون بريفكس.

## المساعدة
- `$help` عرض كل الأوامر حسب القسم.
- `$help <command>` يرسل Embed فيه:
  - وصف الأمر
  - الاختصارات
  - طريقة الاستخدام
  - أمثلة جاهزة

## Dashboard
- صفحة رئيسية منظمة بأقسام مثل Security Bot:
  - General
  - Anti Nuke
  - Beast Mode
  - Anti Raid
  - Verification
  - Moderation
  - Whitelist
  - Logs
  - Anti Spam

## أوامر مهمة
- `/commands-shortcut`
- `/ticket-builder`
- `/security-panel`
- `/autoresponse-panel`
- `/whitelist add|remove|list`
- `/loggers`

## التشغيل
1. عدل `config.json` (token, owners, dashboardPort, prefix).
2. `npm install`
3. `npm run start`
