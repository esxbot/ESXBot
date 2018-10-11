/**
 * @file remove command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: `${args.length ? args.join(' ') : 'You'} is being removed.`,
      image: {
        url: 'https://resources-esx.github.io/images/remove_button.gif'
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'delete' ],
  enabled: true
};

exports.help = {
  name: 'remove',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'remove <text>',
  example: [ 'remove Humanity' ]
};
