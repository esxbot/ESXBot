/**
 * @file cat command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message) => {
  try {
    let options = {
      method: 'HEAD',
      url: 'https://thecatapi.com/api/images/get',
      followAllRedirects: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);

    await message.channel.send({
      files: [ response.request.uri.href ]
    });
  }
  catch (e) {
    if (e.response) {
      return ESXBot.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'cat',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'cat',
  example: []
};
