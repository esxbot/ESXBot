/**
 * @file The starting point of ESXBot
 * @author Renildo Marcio (Kr Soluções Web)
 * @license MIT
 */

const Discord = require('discord.js');
const ESXBOT = new Discord.Client({
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

if (ESXBOT.shard) {
  process.title = `ESXBot-Shard-${ESXBOT.shard.id}`;
}
else {
  process.title = 'ESXBot';
}

ESXBOT.package = require('./package.json');
ESXBOT.credentials = require('./settings/credentials.json');
ESXBOT.config = require('./settings/config.json');
ESXBOT.Constants = Discord.Constants;
ESXBOT.colors = Discord.Constants.Colors;
ESXBOT.permissions = Discord.Permissions.FLAGS;

// require('./utils/Array.prototype');
require('./utils/String.prototype');
require('./utils/Number.prototype');

const WebhookHandler = require('./handlers/webhookHandler.js');
ESXBOT.webhook = new WebhookHandler(ESXBOT.credentials.webhooks);
ESXBOT.log = require('./handlers/logHandler');
ESXBOT.functions = require('./handlers/functionHandler');
const LanguageHandler = require('./handlers/languageHandler');
ESXBOT.strings = new LanguageHandler();
ESXBOT.db = require('sqlite');
ESXBOT.db.open('./data/ESXBot.sqlite').then(db => {
  db.run('PRAGMA foreign_keys = ON');
  require('./utils/populateDatabase')(ESXBOT.db);
});

require('./handlers/eventHandler')(ESXBOT);

const Modules = require('./handlers/moduleHandler');
ESXBOT.commands = Modules.commands;
ESXBOT.aliases = Modules.aliases;

ESXBOT.login(ESXBOT.credentials.token).catch(e => {
  ESXBOT.log.error(e.toString());
  process.exit(1);
});

process.on('unhandledRejection', rejection => {
  // eslint-disable-next-line no-console
  console.warn(`\n[unhandledRejection]\n${rejection}\n[/unhandledRejection]\n`);
});
