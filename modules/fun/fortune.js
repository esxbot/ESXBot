/**
 * @file fortune command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const fortuneCookies = require('../../data/fortuneCookies.json');

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Fortune:',
      description: fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)]
      // description: fortuneCookies.random()
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'cookie' ],
  enabled: true
};

exports.help = {
  name: 'fortune',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fortune',
  example: []
};
