/**
 * @file rip command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: `R.I.P ${args.length ? args.join(' ') : 'Everything'}`,
      image: {
        url: 'https://resources-esx.github.io/images/tombstone_rip.png'
      },
      footer: {
        text: 'May the Soul Rest in Peace.'
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
  name: 'rip',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rip <text>',
  example: [ 'rip Grammar' ]
};
