/**
 * @file steam command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.category) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args.category = args.category.join('_').toLowerCase();

    let options = {
      url: 'https://store.steampowered.com/api/featuredcategories/',
      json: true
    };
    let response = await request(options);

    if (!Object.keys(response).includes(args.category)) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'category'), message.channel);
    }

    let games = response[args.category].items.map(item => `[${item.name}](https://store.steampowered.com/app/${item.id})`);

    let noOfPages = games.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        author: {
          name: 'Steam',
          url: 'https://store.steampowered.com'
        },
        title: response[args.category].name,
        description: games.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Página: ${i + 1} de ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)} • Powered by Steam`
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
    { name: 'category', type: String, multiple: true, defaultOption: true },
    { name: 'page', type: Number, alias: 'p', defaultValue: 1 }
  ]
};

exports.help = {
  name: 'steam',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'steam [ Specials | Coming Soon | Top Sellers | New Releases ]',
  example: [ 'steam New Releases' ]
};
