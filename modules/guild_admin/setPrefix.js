/**
 * @file setPrefix command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.prefix && !args.default) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let prefix, maxPrefix = 5, prefixMaxLength = 8;
    if (args.default) {
      prefix = ESXBot.config.prefix;
    }
    else {
      if (args.prefix.length > maxPrefix) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), `You can only add a maximum of ${maxPrefix} prefixes.`, message.channel);
      }
      prefix = args.prefix.join(' ');
      if (args.prefix.some(prefix => prefix.length > prefixMaxLength)) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'prefixRange', true, prefixMaxLength), message.channel);
      }
    }


    await ESXBot.db.run(`UPDATE guildSettings SET prefix='${prefix}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: ESXBot.strings.info(message.guild.language, 'setPrefix', message.author.tag, prefix)
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'prefix', type: String, alias: 'p', multiple: true, defaultOption: true },
    { name: 'default', type: Boolean, alias: 'd' }
  ]
};

exports.help = {
  name: 'setPrefix',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'setPrefix < prefix | --default >',
  example: [ 'setPrefix !', 'setPrefix --default' ]
};
