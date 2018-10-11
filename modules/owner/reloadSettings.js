/**
 * @file reloadSettings command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  try {
    // eslint-disable-next-line no-sync
    let settings = ESXBot.functions.listFilesSync('settings');
    for (let file of settings) {
      delete require.cache[require.resolve(`../../settings/${file}`)];
    }
    ESXBot.config = require('../../settings/config.json');
    ESXBot.credentials = require('../../settings/credentials.json');

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: 'Successfully reloaded all the settings.'
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
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'reloadSettings',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reloadSettings',
  example: []
};
