/**
 * @file playlist command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const jsonDB = require('node-json-db');
const db = new jsonDB('./data/playlist', true, true);

exports.exec = (ESXBot, message, args) => {
  if (!args.song) {
    db.reload();
    let title = 'Listas de reprodução salvas', color = ESXBot.colors.BLUE, playlist = db.getData('/');

    if (!args.playlist) {
      playlist = Object.keys(playlist);
    }
    else {
      if (args.remove) {
        db.delete(`/${args.playlist.join(' ')}`);
        title = 'Playlist excluída';
        color = ESXBot.colors.RED;
        playlist = [ args.playlist.join(' ') ];
      }
      else {
        title = 'Musicas salvas';
        playlist = playlist[args.playlist.join(' ')];
      }
    }

    if (playlist && playlist.length !== 0) {
      message.channel.send({
        embed: {
          color: color,
          title: title,
          description: playlist.join('\n')
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'song/playlist'), message.channel);
    }
  }
  else {
    args.song = args.song.join(' ');
    args.playlist = args.playlist ? args.playlist.join(' ') : 'default';

    db.reload();
    db.push(`/${args.playlist}`, [ args.song ], false);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Adicionado à playlist',
        fields: [
          {
            name: 'Musica',
            value: args.song
          },
          {
            name: 'Playlist',
            value: args.playlist
          }
        ]
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }

};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'song', type: String, multiple: true, defaultOption: true },
    { name: 'playlist', type: String, multiple: true, alias: 'p' },
    { name: 'remove', type: Boolean, alias: 'r' }
  ],
  musicMasterOnly: true
};

exports.help = {
  name: 'playlist',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'playlist [Song Name] [ -p Playlist Name [ --remove ] ]',
  example: [ 'playlist', 'playlist -p Jazz Collection', 'playlist -p Jazz Collection --remove', 'playlist Shape of You -p My Favs', 'playlist https://www.youtube.com/watch?v=JGwWNGJdvx8' ]
};
