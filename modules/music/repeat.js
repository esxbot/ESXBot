/**
 * @file repeat command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  if (message.guild.music.textChannelID && message.channel.id !== message.guild.music.textChannelID) return ESXBot.log.info('Music channels have been set, so music commands will only work in the music text channel.');

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'emptyQueue'), ESXBot.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  let color, repeatStat = '';
  if (message.guild.music.repeat) {
    color = ESXBot.colors.RED;
    message.guild.music.repeat = false;
    repeatStat = 'Removida a música atual da fila de repetição.';
  }
  else {
    color = ESXBot.colors.GREEN;
    message.guild.music.repeat = true;
    repeatStat = ESXBot.strings.info(message.guild.language, 'repeatSong', message.author.tag);
  }

  message.guild.music.textChannel.send({
    embed: {
      color: color,
      description: repeatStat
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'loop' ],
  enabled: true
};

exports.help = {
  name: 'repeat',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'repeat',
  example: []
};
