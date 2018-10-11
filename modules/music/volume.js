/**
 * @file volume command
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

  let color = ESXBot.colors.GREEN;
  if (args[0] === '+') {
    message.guild.voiceConnection.dispatcher.setVolume((message.guild.voiceConnection.dispatcher.volume * 50 + 2) / 50);
  }
  else if (args[0] === '-') {
    message.guild.voiceConnection.dispatcher.setVolume((message.guild.voiceConnection.dispatcher.volume * 50 - 2) / 50);
  }
  else if (/^\d+$/.test(args[0])) {
    args = args[0] > 0 && args[0] < 100 ? args[0] : 100;
    message.guild.voiceConnection.dispatcher.setVolume(args / 50);
  }
  else {
    color = ESXBot.colors.BLUE;
  }

  message.guild.music.textChannel.send({
    embed: {
      color: color,
      description: `Volume: ${Math.round(message.guild.voiceConnection.dispatcher.volume * 50)}%`
    }
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
  name: 'volume',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'volume < + | - | amount >',
  example: [ 'volume +', 'volume -', 'volume 25' ]
};
