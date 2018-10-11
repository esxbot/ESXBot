/**
 * @file twitch command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.live) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let options = {
      headers: {
        'Client-ID': ESXBot.credentials.twitchClientID,
        'Accept': 'Accept: application/vnd.twitchtv.v3+json'
      },
      url: `https://api.twitch.tv/kraken/streams/${args.live}`,
      json: true
    };
    let response = await request(options);

    let author, fields, image, footer;

    if (response.stream === null) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'noLiveStream', true, args.live), message.channel);
    }

    author = {
      name: response.stream.channel.display_name,
      url: response.stream.channel.url,
      icon_url: response.stream.channel.logo
    };
    fields = [
      {
        name: 'Game',
        value: response.stream.game,
        inline: true
      },
      {
        name: 'Espectadores',
        value: response.stream.viewers,
        inline: true
      }
    ];
    image = {
      url: response.stream.preview.large
    };
    footer = {
      text: '🔴 Ao vivo'
    };

    message.channel.send({
      embed: {
        color: ESXBot.colors.PURPLE,
        author: author,
        title: response.stream.channel.status,
        url: response.stream.channel.url,
        fields: fields,
        image: image,
        footer: footer,
        timestamp: new Date(response.stream.created_at)
      }
    }).catch(e => {
      ESXBot.log.error(e);
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
  enabled: true,
  argsDefinitions: [
    { name: 'live', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'twitch',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'twitch <username>',
  example: [ 'twitch k3rn31p4nic' ]
};
