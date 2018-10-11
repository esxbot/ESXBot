/**
 * @file setAvatar command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!/^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i.test(args.join(' '))) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    await ESXBot.user.setAvatar(args.join(' '));

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: `${ESXBot.user.username}'s avatar changed!`
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'setav' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setAvatar',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setavatar <image_url>',
  example: [ 'setavatar https://example.com/avatar.jpeg' ]
};
