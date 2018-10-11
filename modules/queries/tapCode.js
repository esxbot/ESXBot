/**
 * @file tapCode command
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

  args = args.join(' ').toLowerCase();
  const tap = '•';
  const sp = ' ';
  const tapCode = {
    'a': tap + sp + tap,
    'b': tap + sp + tap + tap,
    'c': tap + sp + tap + tap + tap,
    'd': tap + sp + tap + tap + tap + tap,
    'e': tap + sp + tap + tap + tap + tap + tap,
    'f': tap + tap + sp + tap,
    'g': tap + tap + sp + tap + tap,
    'h': tap + tap + sp + tap + tap + tap,
    'i': tap + tap + sp + tap + tap + tap + tap,
    'j': tap + tap + sp + tap + tap + tap + tap + tap,
    'k': tap + sp + tap + tap + tap,
    'l': tap + tap + tap + sp + tap,
    'm': tap + tap + tap + sp + tap + tap,
    'n': tap + tap + tap + sp + tap + tap + tap,
    'o': tap + tap + tap + sp + tap + tap + tap + tap,
    'p': tap + tap + tap + sp + tap + tap + tap + tap + tap,
    'q': tap + tap + tap + tap + sp + tap,
    'r': tap + tap + tap + tap + sp + tap + tap,
    's': tap + tap + tap + tap + sp + tap + tap + tap,
    't': tap + tap + tap + tap + sp + tap + tap + tap + tap,
    'u': tap + tap + tap + tap + sp + tap + tap + tap + tap + tap,
    'v': tap + tap + tap + tap + tap + sp + tap,
    'w': tap + tap + tap + tap + tap + sp + tap + tap,
    'x': tap + tap + tap + tap + tap + sp + tap + tap + tap,
    'y': tap + tap + tap + tap + tap + sp + tap + tap + tap + tap,
    'z': tap + tap + tap + tap + tap + sp + tap + tap + tap + tap + tap,
    ' ': '\u2001'
  };
  args = args.replace(/\. /g, ' x ');
  args = args.replace(/./g, x => `${tapCode[x]}\u2001`).trim();

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Toque no código',
      description: `**${args}**`
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'tap' ],
  enabled: true
};

exports.help = {
  name: 'tapCode',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'tapCode <text>',
  example: [ 'tapCode Knock Knock' ]
};
