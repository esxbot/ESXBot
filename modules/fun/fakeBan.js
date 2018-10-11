/**
 * @file fakeBan command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await ESXBot.fetchUser(args.id);
    }
    if (!user) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        description: `**${message.author.tag}** has banned **${user.tag}** from this server.*`,
        footer: {
          text: '* Oh, just kidding! XD'
        }
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
  aliases: [ 'fban' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'fakeBan',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fakeBan [ @USER_MENTION | USER_ID ]',
  example: []
};
