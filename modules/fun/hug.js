/**
 * @file hug command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message) => {
  try {
    let options = {
      url: 'http://api.giphy.com/v1/gifs/search',
      qs: {
        q: 'hug',
        api_key: 'dc6zaTOxFJmzC',
        limit: 10,
        offset: 0
      },
      json: true
    };

    let response = await request(options);

    if (response.data.length) {
      message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: `A hug from ${message.author.tag}`,
          image: {
            url: response.data[Math.floor(Math.random() * response.data.length)].images.original.url
          },
          footer: {
            text: 'Powered by GIPHY'
          }
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'image'), message.channel);
    }
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
  name: 'hug',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'hug',
  example: [ 'hug' ]
};
