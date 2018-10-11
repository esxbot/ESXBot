/**
 * @file airhorn command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    if (message.guild.voiceConnection) {
      if (!message.guild.voiceConnection.channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
        /**
        * User has missing permissions.
        * @fires userMissingPermissions
        */
        return ESXBot.emit('userMissingPermissions', this.help.userTextPermission);
      }

      if (message.guild.voiceConnection.speaking) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'busy'), ESXBot.strings.error(message.guild.language, 'isSpeaking', true), message.channel);
      }

      if (!message.guild.voiceConnection.channel.speakable) {
        /**
        * ESXBot has missing permissions.
        * @fires esxbotMissingPermissions
        */
        return ESXBot.emit('esxbotMissingPermissions', 'SPEAK', message);
      }

      message.guild.voiceConnection.playFile('./data/airhorn.wav', { passes: (ESXBot.config.music && ESXBot.config.music.passes) || 1, bitrate: 'auto' });
    }
    else if (message.member.voiceChannel) {
      if (!message.member.voiceChannel.permissionsFor(message.member).has(this.help.userTextPermission)) {
        /**
        * User has missing permissions.
        * @fires userMissingPermissions
        */
        return ESXBot.emit('userMissingPermissions', this.help.userTextPermission);
      }

      if (!message.member.voiceChannel.joinable) {
        /**
        * ESXBot has missing permissions.
        * @fires esxbotMissingPermissions
        */
        return ESXBot.emit('esxbotMissingPermissions', 'CONNECT', message);
      }

      if (!message.member.voiceChannel.speakable) {
        /**
        * ESXBot has missing permissions.
        * @fires esxbotMissingPermissions
        */
        return ESXBot.emit('esxbotMissingPermissions', 'SPEAK', message);
      }

      let connection = await message.member.voiceChannel.join();
      const dispatcher = connection.playFile('./data/airhorn.wav', { passes: (ESXBot.config.music && ESXBot.config.music.passes) || 1, bitrate: 'auto' });

      dispatcher.on('error', error => {
        ESXBot.log.error(error);
      });

      dispatcher.on('end', () => {
        connection.channel.leave();
      });
    }
    else {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', '', ESXBot.strings.error(message.guild.language, 'eitherOneInVC', true), message.channel);
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'horn' ],
  enabled: true
};

exports.help = {
  name: 'airhorn',
  botPermission: '',
  userTextPermission: 'MUTE_MEMBERS',
  userVoicePermission: '',
  usage: 'airhorn',
  example: []
};
