/**
 * @file serverID command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Server ID',
      description: message.guild.id
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'sid' ],
  enabled: true
};

exports.help = {
  name: 'serverID',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'serverID',
  example: []
};
