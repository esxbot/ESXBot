/**
 * @file slots command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let reel = [
    ':custard:',
    ':candy:',
    ':cake:',
    ':icecream:',
    ':lollipop:',
    ':chocolate_bar:',
    // ':moneybag:',
    ':shaved_ice:',
    ':doughnut:',
    ':cookie:',
    ':ice_cream:'
  ];

  let reels = [];
  for (let i = 0; i < 3; i++) {
    reels.push(reel[Math.floor(Math.random() * reel.length)]);
  }

  let result = 'Sorry, you lost.';
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    result = 'Congrats! You won.';
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Slot Machine',
      description: reels.join(' \u05C0 '),
      footer: {
        text: result
      }
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
  name: 'slots',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'slots',
  example: []
};
