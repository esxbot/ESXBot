/**
 * @file translate command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const translate = require('@k3rn31p4nic/google-translate-api');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 2) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let result = await translate(args.slice(1).join(' '), { to: args[0] });

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        description: result.text,
        footer: {
          text: `Powered by Google • Tradução de ${result.from.language.iso.toUpperCase()} to ${args[0].toUpperCase()}`
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.stack.includes('not supported')) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'invalidInput', true, 'language code'), message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'trans' ],
  enabled: true
};

exports.help = {
  name: 'translate',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'translate <language_code> <text>',
  example: [ 'translate EN Je suis génial!' ]
};
