/**
 * @file manga command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const Kitsu = require('kitsu/node');
const kitsu = new Kitsu();

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.name) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let { data: manga } = await kitsu.fetch('manga', {
      filter: {
        text: args.name
      },
      fields: {
        manga: 'titles,slug,synopsis,startDate,endDate,posterImage'
      }
    });
    manga = manga[0];

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: Object.values(manga.titles)[0],
        url: `https://kitsu.io/manga/${manga.slug}`,
        description: manga.synopsis,
        fields: [
          {
            name: 'Status',
            value: manga.endDate ? 'Acabado' : 'Publicação',
            inline: true
          },
          {
            name: 'Publicados',
            value: manga.endDate ? `${manga.startDate} - ${manga.endDate}` : `${manga.startDate} - Presente`,
            inline: true
          }
        ],
        image: {
          url: manga.posterImage.original
        },
        footer: {
          text: 'Powered by Kitsu'
        }
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
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'manga',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'manga <Manga Name>',
  example: [ 'manga Death Note' ]
};
