/**
 * @file calculate command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const mathjs = require('mathjs');

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  try {
    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Resultado:',
        description: mathjs.eval(args.join(' ')).toFixed(2)
      }
    });
  }
  catch (error) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'invalidInput', true, 'mathematical expression'), message.channel);
  }
};

exports.config = {
  aliases: [ 'calc' ],
  enabled: true
};

exports.help = {
  name: 'calculate',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'calculate <mathematical_expression>',
  example: [ 'calculate 9 * 10 - 11' ]
};
