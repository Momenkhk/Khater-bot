const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');
const config = require('./config.json');
const db = require('./database/jsonStore');
const loadCommands = require('./handlers/commandHandler');
const loadEvents = require('./handlers/eventHandler');
const createHotReloader = require('./systems/hotReload');
const createInteractionRouter = require('./systems/interactionRouter');
const createPrefixRouter = require('./systems/prefixRouter');
const createAntiCrash = require('./systems/antiCrash');
const createSecuritySystem = require('./systems/securitySystem');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildWebhooks
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]
});

client.config = config;
client.db = db;
client.cooldowns = new Collection();
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.systems = {};

async function bootstrap() {
  createAntiCrash(client);
  db.init();

  client.systems.security = createSecuritySystem(client);
  client.systems.interactionRouter = createInteractionRouter(client);
  client.systems.prefixRouter = createPrefixRouter(client);

  await loadCommands(client, path.join(__dirname, 'commands'));
  await loadEvents(client, path.join(__dirname, 'events'));

  if (process.env.NODE_ENV !== 'production') {
    client.systems.hotReloader = createHotReloader(client, path.join(__dirname, 'commands'));
  }

  await client.login(process.env.BOT_TOKEN || config.token);
}

bootstrap().catch((error) => {
  console.error('[BOOTSTRAP_ERROR]', error);
  process.exit(1);
});
