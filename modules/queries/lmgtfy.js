/**
 * @file lmgtfy command
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
      title: 'Deixe-me pesquisar isso para você:',
      description: `https://lmgtfy.com/?s=d&q=${encodeURIComponent(args.join(' '))}`,
      footer: {
        text: 'Powered by lmgtfy'
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'lmstfy', 'lmdtfy' ],
  enabled: true
};

exports.help = {
  name: 'lmgtfy',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lmgtfy <text>',
  example: [ 'lmgtfy How to shutdown a computer?' ]
};
