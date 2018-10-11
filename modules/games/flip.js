/**
 * @file flip command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  let outcomes = [
    'Heads',
    'Tails'
  ];
  let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

  if (args[0] && parseInt(args[0])) {
    args[0] = parseInt(args[0]);
    if (args[0] > 10) {
      args[0] = 50;
    }
    for (let i = 1; i < args[0]; i++) {
      outcome += `, ${outcomes[Math.floor(Math.random() * outcomes.length)]}`;
    }
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'You flipped:',
      description: outcome
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
  name: 'flip',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'flip [no_of_coins]',
  example: [ 'flip', 'flip 5' ]
};
