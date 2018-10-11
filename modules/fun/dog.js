/**
 * @file dog command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message) => {
  try {
    let baseURL = 'http://random.dog';

    let options = {
      url: `${baseURL}/woof`,
      json: true
    };
    let response = await request(options);

    await message.channel.send({
      files: [ `${baseURL}/${response}` ]
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
  name: 'dog',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'dog',
  example: []
};
