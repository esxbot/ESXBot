/**
 * @file catFact command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const catFacts = require('../../data/catFacts.json');

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Fato do gato:',
      description: catFacts[Math.floor(Math.random() * catFacts.length)]
      // description: catFacts.random()
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'catFact',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'catfact',
  example: []
};
