const { ShardingManager } = require('discord.js');
const config = require('../config.json');

const manager = new ShardingManager('./index.js', {
  token: process.env.BOT_TOKEN || config.token,
  totalShards: config.sharding
});

manager.on('shardCreate', (shard) => {
  console.log(`[SHARD] Launched shard ${shard.id}`);
});

manager.spawn();
