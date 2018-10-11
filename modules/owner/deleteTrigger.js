/**
 * @file deleteTrigger command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args[0]) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    await ESXBot.db.run(`DELETE FROM triggers WHERE trigger="${args.join(' ').replace(/"/g, '\'')}"`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        title: 'Trigger deleted',
        description: args.join(' ')
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
  aliases: [ 'deltrigger', 'deletetrip', 'deltrip' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'deleteTrigger',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'deleteTrigger <trigger>',
  example: [ 'deleteTrigger Hi, there?' ]
};
