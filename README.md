# Khater Bot (Discord.js v14)

Production-oriented, modular Discord bot architecture designed for high-scale communities.

## Highlights
- Dual command stack (slash + prefix) with dynamic loaders.
- Hot-reload in non-production.
- MongoDB-backed guild config, moderation cases, warnings, leveling, tickets, invites, and protection state.
- Advanced systems modules: AutoMod, anti-raid, welcome/leave, auto responses, logging, tickets, voice tracking, and sharding.
- Discord Components v2 panels for ticket and role interaction flows.
- Security hardening: owner-only commands, permission gates, cooldowns, sliding-window rate limiting, anti-crash process guards.

## Structure
```
commands/
events/
handlers/
systems/
database/
models/
utils/
index.js
config.json
```

## Run
1. Update `config.json` and/or set `BOT_TOKEN`.
2. `npm install`
3. `npm run start` or `npm run shard`
