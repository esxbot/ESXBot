/**
 * @file setUsername command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.join(' ').length >= 1) {
      await ESXBot.user.setUsername(args.join(' '));

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `${ESXBot.user.username}'s username is now set to **${args.join(' ')}**`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'setun' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setUsername',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setUsername <text>',
  example: [ 'setUsername NewUsername' ]
};
