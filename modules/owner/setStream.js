/**
 * @file setStream command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!/^((https:\/\/)(www\.)?(twitch\.tv)\/[a-z0-9-._]+)$/i.test(args[0]) || args.slice(1).join(' ').length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    await ESXBot.user.setActivity(args.slice(1).join(' '), {
      type: 1,
      url: args[0]
    });

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: `${ESXBot.user.username} is now streaming **${args.slice(1).join(' ')}**`
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
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setStream',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setStream <twitch> <Status text>',
  example: [ 'setStream https://twitch.tv/k3rn31p4nic Nothing' ]
};
