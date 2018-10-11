/**
 * @file stop command
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

  message.guild.music.textChannel.send({
    embed: {
      color: ESXBot.colors.RED,
      description: 'Parou a reprodução.'
    }
  }).then(() => {
    if (message.guild.music) {
      message.guild.music.songs = [];
    }
    message.guild.music.dispatcher.end();
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  musicMasterOnly: true
};

exports.help = {
  name: 'stop',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'stop',
  example: []
};
