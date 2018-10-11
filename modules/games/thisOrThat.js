/**
 * @file thisOrThat command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const question = require('../../data/thisOrThat.json');

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      description: question[Math.floor(Math.random() * question.length)]
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'thisthat' ],
  enabled: true
};

exports.help = {
  name: 'thisOrThat',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'thisOrThat',
  example: []
};
