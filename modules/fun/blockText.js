/**
 * @file blockText command
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

  let blockedChars = args.join(' ').toLowerCase().
    replace(/[a-z]/g, ':regional_indicator_$&:').
    replace(/1/g, ':one:').
    replace(/2/g, ':two:').
    replace(/3/g, ':three:').
    replace(/4/g, ':four:').
    replace(/5/g, ':five:').
    replace(/6/g, ':six:').
    replace(/7/g, ':seven:').
    replace(/8/g, ':eight:').
    replace(/9/g, ':nine:').
    replace(/0/g, ':zero:');

  message.channel.send(blockedChars).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'block' ],
  enabled: true
};

exports.help = {
  name: 'blockText',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'blockText <text>',
  example: [ 'blockText Hello, world!' ]
};
