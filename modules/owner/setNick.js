/**
 * @file setNick command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length > 0) {
      await message.guild.me.setNickname(args.join(' '));

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `${ESXBot.user.username}'s nick is now set to **${args.join(' ')}** on this guild.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      await message.guild.me.setNickname('');

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `${ESXBot.user.username}'s nick has been reset on this guild.`
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
  aliases: [ 'setn' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setNick',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setNick [text]',
  example: [ 'setNick NewNick', 'setNick' ]
};
