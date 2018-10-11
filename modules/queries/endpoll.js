/**
 * @file endpoll command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  if (message.channel.poll && message.channel.poll.collector) {
    message.channel.poll.collector.stop();
  }
};

exports.config = {
  aliases: [ 'pollend' ],
  enabled: true
};

exports.help = {
  name: 'endpoll',
  botPermission: '',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'endpoll',
  example: []
};
