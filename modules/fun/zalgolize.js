/**
 * @file zalgolize command
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
      title: 'Zalgolized Text:',
      description: ESXBot.functions.zalgolize(args.join(' '))
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'zalgo' ],
  enabled: true
};

exports.help = {
  name: 'zalgolize',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'zalgolize <text>',
  example: [ 'zalgolize It looks clumsy, but it\'s cool!' ]
};
