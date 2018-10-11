/**
 * @file ship command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let users = message.mentions.users.map(u => u.username);
  if (users.length < 2) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  let shippedName = '';
  for (let i = 0; i < users.length; i++) {
    shippedName += `${users[i].substring(0, users[i].length / 2)}`;
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Shipped Users',
      description: `${users.join(' + ')} = **${shippedName}**`
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'ship',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'ship <USER_MENTION> <USER_MENTION> [...USER_MENTION]',
  example: [ 'ship user#0001 user#0002 user#0003' ]
};
