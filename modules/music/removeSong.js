/**
 * @file removeSong command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (message.guild.music.textChannelID && message.channel.id !== message.guild.music.textChannelID) return ESXBot.log.info('Music channels have been set, so music commands will only work in the music text channel.');

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    /**
    * Error condition is encountered.
    * @fires error
    */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'emptyQueue'), ESXBot.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  if (!args.index) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  if (args.index >= message.guild.music.songs.length || args.index < 1) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'indexRange', true), message.channel);
  }

  let removedSong = message.guild.music.songs.splice(args.index, 1);
  removedSong = removedSong[0];

  message.guild.music.textChannel.send({
    embed: {
      color: ESXBot.colors.RED,
      title: 'Removido da fila',
      url: removedSong.id ? `https://youtu.be/${removedSong.id}` : '',
      description: removedSong.title,
      thumbnail: {
        url: removedSong.thumbnail
      },
      footer: {
        text: `Posição: ${args.index} • Solicitante: ${removedSong.requester}`
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'index', type: Number, defaultOption: true }
  ],
  musicMasterOnly: true
};

exports.help = {
  name: 'removeSong',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'removeSong [index]',
  example: [ 'removeSong 3' ]
};
