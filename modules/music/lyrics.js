/**
 * @file lyrics command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.song) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let options = {
      headers: {
        'Accept': 'Accept: application/json'
      },
      url: `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&q_track=${encodeURIComponent(args.song)}&apikey=${ESXBot.credentials.musixmatchAPIKey}`,
      json: true
    };
    let response = await request(options);

    if (response.message.header.status_code === 200) {
      message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: `${args.song.join(' ').toTitleCase()} - Letra da música`,
          description: response.message.body.lyrics.lyrics_body.replace('******* Esta letra não é para uso comercial *******', `Veja as letras completas em [musixmatch.com](${response.message.body.lyrics.backlink_url} 'Musixmatch')`),
          footer: {
            text: `Powered by Musixmatch • Idioma: ${response.message.body.lyrics.lyrics_language_description.toTitleCase()}`
          }
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else if (response.message.header.status_code === 404) {
      message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          title: 'Não encontrado',
          description: `Nenhuma letra foi encontrada para **${args.song.join(' ').toTitleCase()}**.\nSe você acha que está procurando a música certa, tente adicionar o nome do artista ao termo de pesquisa e tente novamente.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
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
    { name: 'song', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'lyrics',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lyrics <SONG_NAME> [Artist Name>]',
  example: [ 'lyrics Something just like this', 'lyrics Shape of you - Ed Sheeran' ]
};
