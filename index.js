const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');
const config = require('./config.json');
const loadCommands = require('./handlers/commandHandler');
const loadEvents = require('./handlers/eventHandler');
const createHotReloader = require('./systems/hotReload');
const createInteractionRouter = require('./systems/interactionRouter');
const createPrefixRouter = require('./systems/prefixRouter');
const createAntiCrash = require('./systems/antiCrash');
const createSecuritySystem = require('./systems/securitySystem');
const startDashboard = require('./src/dashboard/server');
const fileStore = require('./src/database/fileStore');
const legacyStore = require('./database/jsonStore');

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
client.db = legacyStore;
client.cooldowns = new Collection();
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.commandAliases = new Collection();
client.systems = {};

async function bootstrap() {
  createAntiCrash(client);
  fileStore.ensure();
  legacyStore.init();

  client.systems.security = createSecuritySystem(client);
  client.systems.interactionRouter = createInteractionRouter(client);
  client.systems.prefixRouter = createPrefixRouter(client);

  await loadCommands(client, path.join(__dirname, 'commands'));
  await loadEvents(client, path.join(__dirname, 'events'));

  startDashboard(client, config.dashboardPort || 3001);

  if (process.env.NODE_ENV !== 'production') {
    client.systems.hotReloader = createHotReloader(client, path.join(__dirname, 'commands'));
  }

  await client.login(process.env.BOT_TOKEN || config.token);
}

bootstrap().catch((error) => {
  console.error('[BOOTSTRAP_ERROR]', error);
  process.exit(1);
});
