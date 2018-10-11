/**
 * @file deleteAllTriggers command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    await ESXBot.db.all('DELETE FROM triggers');

    message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        description: 'Deleted all the triggers and responses.'
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'delalltriggers', 'deletealltrips', 'delalltrips' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'deleteAllTriggers',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'deleteAllTriggers',
  example: []
};
