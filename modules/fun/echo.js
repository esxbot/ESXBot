/**
 * @file echo command
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
      color: ESXBot.colors.DEFAULT,
      description: args.join(' '),
      footer: {
        text: `${ESXBot.credentials.ownerId.includes(message.author.id) ? '' : 'This is not an official message from ESXBot or from its creators.'}`
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'say' ],
  enabled: true
};

exports.help = {
  name: 'echo',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'echo <text>',
  example: [ 'echo Hello, world!' ]
};
