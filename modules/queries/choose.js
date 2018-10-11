/**
 * @file choose command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1 || !/^(.+( ?\/ ?.+[^/])+)$/i.test(args = args.join(' '))) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  args = args.split('/');
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Na minha opinião',
      description: args[Math.floor(Math.random() * args.length)]
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'decide' ],
  enabled: true
};

exports.help = {
  name: 'choose',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'choose <choice1>/<choice2>[/<choice3>][...]',
  example: [ 'choose Chocolate/Ice Cream/Cake' ]
};
