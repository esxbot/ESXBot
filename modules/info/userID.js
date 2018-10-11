/**
 * @file userID command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let user = message.mentions.users.first();
  if (!user) {
    user = message.author;
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      fields: [
        {
          name: `${user.bot ? 'Bot' : 'Usuário'}`,
          value: user.tag,
          inline: true
        },
        {
          name: 'ID',
          value: user.id,
          inline: true
        }
      ]
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'uid' ],
  enabled: true
};

exports.help = {
  name: 'userID',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'userID [@user-mention]',
  example: [ 'userID @user#0001', 'userID' ]
};
