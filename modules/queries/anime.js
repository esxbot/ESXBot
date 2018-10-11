/**
 * @file anime command
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

    let { data: anime } = await kitsu.fetch('anime', {
      filter: {
        text: args.name
      },
      fields: {
        anime: 'titles,slug,synopsis,startDate,endDate,ageRating,ageRatingGuide,nsfw,posterImage'
      }
    });
    anime = anime[0];

    if (anime) {
      message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: Object.values(anime.titles)[0],
          url: `https://kitsu.io/anime/${anime.slug}`,
          description: anime.synopsis,
          fields: [
            {
              name: 'Status',
              value: anime.endDate ? 'Acabado' : 'Aeração',
              inline: true
            },
            {
              name: 'Arejado',
              value: anime.endDate ? `${anime.startDate} - ${anime.endDate}` : `${anime.startDate} - Presente`,
              inline: true
            },
            {
              name: 'Avaliação',
              value: `${anime.ageRating} - ${anime.ageRatingGuide} ${anime.nsfw ? '[NSFW]' : ''}`,
              inline: true
            }
          ],
          image: {
            url: anime.posterImage.original
          },
          footer: {
            text: 'Powered by Kitsu'
          }
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'anime'), message.channel);
    }
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
  name: 'anime',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'anime <Anime Name>',
  example: [ 'anime One Piece' ]
};
