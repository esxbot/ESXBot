/**
 * @file wikipedia command
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

    let options = {
      url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|info|pageimages&exsentences=10&exintro=true&explaintext=true&inprop=url&pithumbsize=512&redirects=1&formatversion=2&titles=${args.join(' ')}`,
      json: true
    };

    let response = await request(options);

    let color, description = '', data = [], thumbnail = '';
    color = ESXBot.colors.BLUE;
    response = response.query.pages[0];

    if (response.missing) {
      color = ESXBot.colors.RED;
      description = `**${args.join(' ')}** não foi encontrado na Wikipedia.`;
    }
    else {
      data = [
        {
          name: response.title || args.join(' '),
          value: `${response.extract.length < 1000 ? response.extract : response.extract.slice(0, 950)}... [Leia mais](${response.fullurl})`
        }
      ];
      thumbnail = response.thumbnail ? response.thumbnail.source : 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png';
    }

    message.channel.send({
      embed: {
        color: color,
        title: 'Wikipedia',
        description: description,
        fields: data,
        thumbnail: {
          url: thumbnail
        },
        footer: {
          text: 'Powered by Wikipedia'
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
  aliases: [ 'wiki' ],
  enabled: true
};

exports.help = {
  name: 'wikipedia',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'wikipedia <text>',
  example: [ 'wikipedia Steve Jobs' ]
};
