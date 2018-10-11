/**
 * @file isBreached command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.name) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args.name = args.name.join('');

    let options = {
      method: 'GET',
      headers: {
        'User-Agent': 'ESXBot/renildomarcio',
        'Accept': 'application/json'
      },
      url: `https://haveibeenpwned.com/api/v2/breach/${args.name}`,
      json: true
    };
    let response = await request(options);

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        author: {
          name: response.Title,
          url: `http://${response.Domain}`
        },
        fields: [
          {
            name: 'Dados comprometidos',
            value: response.DataClasses.join(', ')
          },
          {
            name: 'Data de violação',
            value: response.BreachDate,
            inline: true
          },
          {
            name: 'Verificado',
            value: response.IsVerified,
            inline: true
          }
        ],
        footer: {
          text: 'Powered by Have I been pwned?'
        }
      }
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
  aliases: [ 'isPwned' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'isBreached',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'isBreached <site_name>',
  example: [ 'isBreached Adobe' ]
};
