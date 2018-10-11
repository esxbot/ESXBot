/**
* @file leet command
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

  args = args.join(' ');
  args = args.replace(/a/ig, '4');
  args = args.replace(/e/ig, '3');
  args = args.replace(/l/ig, '1');
  args = args.replace(/o/ig, '0');
  args = args.replace(/s/ig, '5');
  args = args.replace(/t/ig, '7');

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Leet Text',
      description: args
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ '1337' ],
  enabled: true
};

exports.help = {
  name: 'leet',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leet <text>',
  example: [ 'leet Hello, Everyone!' ]
};
