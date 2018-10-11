/**
 * @file shorten command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args = encodeURI(args.join(' '));
    if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(args)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'invalidInput', true, 'URL'), message.channel);
    }

    let options = {
      url: `https://www.googleapis.com/urlshortener/v1/url?key=${ESXBot.credentials.googleAPIkey}`,
      method: 'POST',
      json: {
        longUrl: args
      }
    };

    let response = await request(options);

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        fields: [
          {
            name: 'Long URL',
            value: args
          },
          {
            name: 'Short URL',
            value: response.id
          }
        ],
        footer: {
          text: 'Powered by Google'
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      return ESXBot.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'shorten',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shorten <URL>',
  example: [ 'shorten https://resources-esx.github.io/SomeLongURL' ]
};
