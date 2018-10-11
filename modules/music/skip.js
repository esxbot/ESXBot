/**
 * @file skip command
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

  if (!ESXBot.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.musicMasterRole)) {
    if (!message.guild.music.skipVotes.includes(message.author.id)) {
      message.guild.music.skipVotes.push(message.author.id);
    }
    if (message.guild.music.skipVotes.length >= parseInt((message.guild.voiceConnection.channel/* voiceChannel */.members.size - 1) / 2)) {
      message.guild.music.textChannel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: 'Saltando a música atual.'
        }
      }).then(() => {
        message.guild.music.dispatcher.end();
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      message.guild.music.textChannel.send({
        embed: {
          description: `${parseInt((message.guild.voiceConnection.channel/* voiceChannel */.members.size - 1) / 2) - message.guild.music.skipVotes.length} votes required to skip the current song.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
  }
  else {
    message.guild.music.textChannel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: 'Saltando a música atual.'
      }
    }).then(() => {
      message.guild.music.dispatcher.end();
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'skip',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'skip',
  example: []
};
