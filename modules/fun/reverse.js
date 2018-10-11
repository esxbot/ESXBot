/**
 * @file reverse command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Reversed Text:',
      description: args.join(' ').split('').reverse().join('')
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'rev' ],
  enabled: true
};

exports.help = {
  name: 'reverse',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reverse <text>',
  example: [ 'reverse !looc si sihT' ]
};
