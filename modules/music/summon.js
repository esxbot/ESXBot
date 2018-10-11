/**
 * @file summon command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let voiceChannel;
    if (ESXBot.credentials.ownerId.includes(message.author.id) || message.member.roles.has(message.guild.music.masterRoleID)) {
      voiceChannel = message.member.voiceChannel;
      if (!voiceChannel) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', '', ESXBot.strings.error(message.guild.language, 'userNoVC', true, message.author.tag), message.channel);
      }
    }
    else {
      if (message.guild.music.textChannelID !== message.channel.id) return ESXBot.log.info('Os canais de música foram definidos, portanto, os comandos de música só funcionarão no canal de texto da música.');

      voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(message.guild.music.voiceChannelID);
      if (!voiceChannel) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), ESXBot.strings.error(message.guild.language, 'invalidMusicChannel', true), message.channel);
      }
    }

    if (!voiceChannel.joinable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), ESXBot.strings.error(message.guild.language, 'noPermission', true, 'join', voiceChannel.name), message.channel);
    }
    if (!voiceChannel.speakable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), ESXBot.strings.error(message.guild.language, 'noPermission', true, 'speak', `in ${voiceChannel.name}`), message.channel);
    }

    let connection = await voiceChannel.join();

    message.guild.me.setMute(false).catch(() => {});
    message.guild.me.setDeaf(true).catch(() => {});

    if (!connection.speaking) {
      connection.playFile('./data/greeting.mp3', { passes: (ESXBot.config.music && ESXBot.config.music.passes) || 1, bitrate: 'auto' });
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'join' ],
  enabled: true
};

exports.help = {
  name: 'summon',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'summon',
  example: []
};
