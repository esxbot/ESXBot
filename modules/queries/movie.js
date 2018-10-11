/**
 * @file movie command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.movie) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/search/movie?api_key=&query=${encodeURIComponent(args.movie)}`,
      qs: {
        api_key: ESXBot.credentials.theMovieDBApiKey
      },
      json: true
    };
    let movie = await request(options);

    movie = movie.results[0];

    if (!movie) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'movie'), message.channel);
    }

    // Hard coded genre IDs because they are not likely to change for v3 and dynamically getting them would mean sending another request, since it's a seperate endpoint.
    let genre_list = { '28': 'Ação', '12': 'Aventura', '16': 'Animação', '35': 'Comédia', '80': 'Crime', '99': 'Documentário', '18': 'Drama', '10751': 'Família', '14': 'Fantasia', '36': 'História', '27': 'Horror', '10402': 'Música', '9648': 'Mistério', '10749': 'Romance', '878': 'Ficção científica', '10770': 'Filme de TV', '53': 'Suspense', '10752': 'Guerra', '37': 'Ocidental' };

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: movie.title,
        url: `https://themoviedb.org/movie/${movie.id}`,
        description: movie.overview,
        fields: [
          {
            name: 'Gênero',
            value: movie.genre_ids.map(id => genre_list[id]).join('\n'),
            inline: true
          },
          {
            name: 'Língua',
            value: movie.original_language.toUpperCase(),
            inline: true
          },
          {
            name: 'Avaliação',
            value: `${movie.vote_average}`,
            inline: true
          },
          {
            name: 'Data de lançamento',
            value: movie.release_date,
            inline: true
          }
        ],
        image: {
          url: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        },
        footer: {
          text: 'Powered by The Movie Database'
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
  aliases: [ 'film' ],
  enabled: true,
  argsDefinitions: [
    { name: 'movie', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'movie',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'movie <Movie Name>',
  example: [ 'movie John Wick' ]
};
