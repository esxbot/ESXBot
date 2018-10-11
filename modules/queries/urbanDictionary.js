/**
 * @file urbanDictionary command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!message.channel.nsfw) {
      return ESXBot.emit('error', '', 'O Dicionário Urbano pode retornar resultados que são NSFW, portanto, esse comando funciona apenas nos canais NSFW.', message.channel);
    }

    if (args.length < 1) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let options = {
      url: `https://api.urbandictionary.com/v0/define?term=${args.join(' ')}`,
      json: true
    };
    let response = await request(options);

    response = response.list[0];

    if (!response) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'word'), message.channel);
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Dicionário Urbano',
        fields: [
          {
            name: 'Palavra',
            value: response.word || args.join(' ')
          },
          {
            name: 'Definição',
            value: response.definition || '-'
          },
          {
            name: 'Exemplo',
            value: response.example || '-'
          }
        ],
        footer: {
          text: 'Powered by Urban Dictionary'
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
  aliases: [ 'ud' ],
  enabled: true
};

exports.help = {
  name: 'urbanDictionary',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'urbanDictionary <word>',
  example: [ 'urbanDictionary pineapple' ]
};
