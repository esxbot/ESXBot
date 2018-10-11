/**
 * @file wouldYouRather command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const question = require('../../data/wouldYouRather.json');

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
  aliases: [ 'wouldyou' ],
  enabled: true
};

exports.help = {
  name: 'wouldYouRather',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'wouldYouRather',
  example: []
};
