/**
 * @file Test script to test ESXBot's successful booting
 * @author Renildo Marcio (KR Soluções Web)
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

ESXBOT.package = require('../package.json');
ESXBOT.credentials = require('../settings/credentials.json');
ESXBOT.config = require('../settings/config.json');
ESXBOT.colors = Discord.Constants.Colors;

// require('./utils/Array.prototype');
require('../utils/String.prototype');
require('../utils/Number.prototype');

ESXBOT.log = require('../handlers/logHandler');
ESXBOT.functions = require('../handlers/functionHandler');
const LanguageHandler = require('../handlers/languageHandler');
ESXBOT.strings = new LanguageHandler();
ESXBOT.db = require('sqlite');
ESXBOT.db.open('./data/ESXBot.sqlite').then(db => {
  db.run('PRAGMA foreign_keys = ON');
  require('../utils/populateDatabase')(ESXBOT.db);
}).catch(e => {
  ESXBOT.log.error(e.stack);
  process.exit(1);
});

require('../handlers/eventHandler')(ESXBOT);

const Modules = require('../handlers/moduleHandler');
ESXBOT.commands = Modules.commands;
ESXBOT.aliases = Modules.aliases;

if (ESXBOT.commands && ESXBOT.aliases) {
  ESXBOT.log.info(`Successfully loaded ${ESXBOT.commands.size} commands`);
}
else {
  ESXBOT.log.error('Failed to load commands.');
  process.exit(1);
}
