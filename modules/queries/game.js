/**
 * @file game command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.name || !args.name.length) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args.name = args.name.join(' ');

    let options = {
      headers: {
        'User-Agent': `ESXBot: Discord Bot (https://esxbot.github.io, ${ESXBot.package.version})`,
        'Accept': 'application/json',
        'User-Key': ESXBot.credentials.IGDBUserKey
      },
      url: 'https://api-endpoint.igdb.com/games/',
      qs: {
        search: encodeURIComponent(args.name),
        fields: '*',
        limit: 1
      },
      json: true
    };
    let response = await request(options);
    response = response[0];

    if (!response) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'game'), message.channel);
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: response.name,
        url: response.url,
        description: response.summary,
        fields: [
          {
            name: 'Avaliação',
            value: response.total_rating ? response.total_rating.toFixed(2) : '-',
            inline: true
          },
          {
            name: 'Data de lançamento',
            value: new Date(response.first_release_date).toDateString(),
            inline: true
          },
          {
            name: 'Links',
            value: response.websites ? response.websites.map(website => website.url).join('\n') : '-'
          }
        ],
        image: {
          url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${response.cover.cloudinary_id}.jpg`
        },
        footer: {
          text: 'Powered by IGDB'
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
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'game',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'game <NAME>',
  example: [ 'game Call of Duty Infinite Warfare', 'game Overwatch' ]
};
