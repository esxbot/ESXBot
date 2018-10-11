/**
 * @file followURL command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const followURL = require('../../functions/followURL');

exports.exec = async (ESXBot, message, args) => {
  try {
    let url = args.url.join(' ');

    if (!/^(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(url)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'invalidInput', true, 'URL'), message.channel);
    }

    let followedUrl = await followURL(url);

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        fields: [
          {
            name: 'URL',
            value: url
          },
          {
            name: 'Followed URL',
            value: followedUrl
          }
        ]
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
  argsDefinitions: [
    { name: 'url', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'followURL',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'followURL',
  example: []
};
