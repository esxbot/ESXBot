/**
 * @file youtubeSearch command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const yt = require('youtube-dl');

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  args = `ytsearch:${args.join(' ')}`;
  yt.getInfo(args, [ '-q', '--skip-download', '--no-warnings', '--format=bestaudio[protocol^=http]' ], (err, info) => {
    if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
      let error, errorMessage;
      if (err && err.stack.includes('No video results')) {
        error = ESXBot.strings.error(message.guild.language, 'notFound');
        errorMessage = ESXBot.strings.error(message.guild.language, 'notFound', true, 'video');
      }
      else {
        error = ESXBot.strings.error(message.guild.language, 'connection');
        errorMessage = ESXBot.strings.error(message.guild.language, 'connection', true);
      }
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', error, errorMessage, message.channel);
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        author: {
          name: info.uploader,
          url: info.uploader_url
        },
        title: info.title,
        url: `https://youtu.be/${info.id}`,
        fields: [
          {
            name: 'Likes',
            value: `${info.like_count}`,
            inline: true
          },
          {
            name: 'Dislikes',
            value: `${info.dislike_count}`,
            inline: true
          },
          {
            name: 'Visualizações',
            value: `${info.view_count}`,
            inline: true
          }
        ],
        image: {
          url: info.thumbnail
        },
        footer: {
          text: info.is_live ? 'Agora ao vivo' : `Duração: ${info.duration}`
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'ytsearch' ],
  enabled: true
};

exports.help = {
  name: 'youtubeSearch',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'youtubeSearch <text>',
  example: [ 'youtubeSearch Call of Duty WW2' ]
};
