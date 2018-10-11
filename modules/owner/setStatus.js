/**
 * @file setStatus command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.status && /^(?:online|idle|dnd|invisible)$/i.test(args.status)) {
      await ESXBot.user.setStatus(args.status);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `${ESXBot.user.username}'s status is now set to **${args.status}**`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      await ESXBot.user.setStatus(ESXBot.config.status);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `${ESXBot.user.username}'s status is now set to the default status **${ESXBot.config.status}**`
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'status', type: String, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'setStatus',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setStatus [online|idle|dnd|invisible]',
  example: [ 'setStatus invisible', 'setStatus' ]
};
