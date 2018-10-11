/**
 * @file disconnect command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  try {
    if (message.guild.music) {
      message.guild.music.songs = [];

      if (message.guild.music.dispatcher) {
        message.guild.music.dispatcher.end();
      }
    }

    if (message.guild.voiceConnection) {
      message.guild.voiceConnection.disconnect();
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        description: 'Desconectado da conexão de voz deste servidor.'
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
  musicMasterOnly: true
};

exports.help = {
  name: 'disconnect',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'disconnect',
  example: []
};
