/**
 * @file sweep command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let sweepedUser = message.channel.members.filter(m => !m.user.bot).random();

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Sweeped user',
      fields: [
        {
          name: 'User',
          value: sweepedUser.user.tag,
          inline: true
        },
        {
          name: 'ID',
          value: sweepedUser.id,
          inline: true
        }
      ]
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
  name: 'sweep',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sweep',
  example: []
};
