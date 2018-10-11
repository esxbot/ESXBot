/**
 * @file Language Handler
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

/* eslint-disable no-sync */
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const color = require('chalk');

const locales = new Discord.Collection();
const languages = fs.readdirSync('./locales/').filter(file => fs.statSync(path.join('./locales/', file)).isDirectory());
const constants = {
  '%esxbot%': 'ESXBot',
  '%currencyName%': 'ESXBot Moeda',
  '%_currencyName%': 'ESXBot Moedas',
  '%currencySymbol%': 'EXB',
  '%esxbotSite%': 'https://esxbot.github.io',
  '%discordInvLink%': 'https://discord.gg/8zGbh3T'
};

for (let language of languages) {
  process.stdout.write(`${color.cyan('[ESXBot]:')} Loading ${language.toUpperCase()} language...\n`);
  const strings = {};
  let stringFiles = fs.readdirSync(`./locales/${language}`);

  for (let stringFile of stringFiles) {
    let file = stringFile.substr(0, stringFile.length - 5);
    process.stdout.write(`${color.cyan('[ESXBot]:')} Loading strings for ${file}...\n`);
    stringFile = require(`../locales/${language}/${stringFile}`);
    strings[file] = stringFile;

    if (process.stdout.moveCursor) {
      process.stdout.moveCursor(0, -1);
    }
    if (process.stdout.clearLine) {
      process.stdout.clearLine();
    }
  }

  locales.set(language, strings);

  if (process.stdout.moveCursor) {
    process.stdout.moveCursor(0, -1);
  }
  if (process.stdout.clearLine) {
    process.stdout.clearLine();
  }
}

/**
 * Used to handle strings of different languages from external files.
 * @module languageHandler
 */
module.exports = class LanguageHandler {
  /**
   * @constructor
   */
  constructor() {
    this.locales = locales;
  }

  /**
   * Returns a list of languages supported by ESXBot
   * @function getAvailableLanguages
   * @returns {Array} Array of languages supported by ESXBot
   */
  get availableLanguages() {
    return languages;
  }

  /**
   * Returns the error message string for the given key.
   * @function error
   * @param {String} locale The locale of the string
   * @param {String} key The key of the string
   * @param {Boolean} description Whether to return the description or the title
   * @returns {String} The string mapped by the key and namespace
   */
  error(locale, key, description = false, ...vars) {
    if (!this.locales.has(locale)) {
      locale = 'pt-br';
    }

    let namespace, regex = new RegExp(Object.keys(constants).join('|'), 'gi');
    if (description) {
      if (!this.locales.get(locale).errors['descriptions'][key]) {
        if (locale === 'pt-br') {
          return `No string found for '${key}' in error descriptions.`;
        }
        return this.error('pt-br', key, description, ...vars);
      }
      namespace = 'descriptions';
    }
    else {
      if (!this.locales.get(locale).errors['types'][key]) {
        if (locale === 'pt-br') {
          return `No string found for '${key}' in error types.`;
        }
        return this.error('pt-br', key);
      }
      namespace = 'types';
    }
    return this.locales.get(locale).errors[namespace][key].replace(regex, matched => constants[matched]).substitute(...vars);
  }

  /**
   * Returns the command description string for the given key.
   * @function command
   * @param {String} locale The locale of the string
   * @param {String} module The module that is mapped to the command
   * @param {String} command The command that is mapped to the string
   * @returns {String} The string mapped by the command and module
   */
  command(locale, module, command) {
    if (!this.locales.has(locale)) {
      locale = 'pt-br';
    }

    if (!this.locales.get(locale).modules[module] || !this.locales.get(locale).modules[module][command]) {
      if (locale === 'pt-br') {
        return `No string found for '${command}' command in ${module} module.`;
      }
      return this.command('pt-br', module, command);
    }

    return this.locales.get(locale).modules[module][command];
  }

  /**
   * Returns the event strings for the given key (event).
   * @function events
   * @param {String} locale The locale of the string
   * @param {String} event The key for the required event
   * @returns {String} The event string
   */
  events(locale, event) {
    if (!this.locales.has(locale)) {
      locale = 'pt-br';
    }

    if (!this.locales.get(locale).events[event]) {
      if (locale === 'pt-br') {
        return `No string found for the '${event}' event.`;
      }
      return this.events('pt-br', event);
    }
    return this.locales.get(locale).events[event];
  }

  /**
   * Returns the info strings for the given key.
   * @function info
   * @param {String} locale The locale of the string
   * @param {String} key The key for the required info string
   * @returns {String} The info string
   */
  info(locale, key, ...vars) {
    if (!this.locales.has(locale)) {
      locale = 'pt-br';
    }

    if (!this.locales.get(locale).info[key]) {
      if (locale === 'pt-br') {
        return `No info string found for the key '${key}'.`;
      }
      return this.info('pt-br', key, ...vars);
    }
    return this.locales.get(locale).info[key].substitute(...vars);
  }
};
