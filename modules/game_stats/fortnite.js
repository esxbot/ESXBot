/**
 * @file fortnite command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.player) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    // If user doesn't provide the platform, default to PC
    if (!args.platform) {
      args.platform = 'pc';
    }
    else {
      let platforms = [ 'pc', 'xbl', 'psn' ]; // Available platforms for the game
      // If the platform is not valid, return the available platforms
      if (!platforms.includes(args.platform = args.platform.toLowerCase())) {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'invalidPlatform', true, `${platforms.join(', ').toUpperCase()}`), message.channel);
      }
    }

    let options = {
      uri: `https://api.fortnitetracker.com/v1/profile/${args.platform}/${encodeURIComponent(args.player.join(' '))}`,
      headers: {
        'TRN-Api-Key': ESXBot.credentials.fortniteAPIKey,
        'User-Agent': `ESXBot/${ESXBot.package.version} (${ESXBot.user.tag}; ${ESXBot.user.id}) https://esxbot.github.io`
      },
      json: true
    };

    let player = await request(options);
    if (player.error) {
      return ESXBot.emit('error', 'Error', player.error, message.channel);
    }

    let stats = player.lifeTimeStats.map(stat => {
      return {
        name: stat.key,
        value: stat.value,
        inline: true
      };
    });

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        author: {
          name: player.epicUserHandle
        },
        title: `Fortnite Stats - ${player.platformNameLong}`,
        fields: stats,
        thumbnail: {
          url: 'https://i.imgur.com/dfgwClZ.jpg'
        },
        footer: {
          text: 'Powered by Tracker Network'
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.name === 'StatusCodeError') {
      return ESXBot.emit('error', e.statusCode, e.error.message, message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'player', type: String, multiple: true, defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'PC' }
  ]
};

exports.help = {
  name: 'fortnite',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fortnite <EPIC_NICKNAME> [ -p <PLATFORM> ]',
  example: [ 'fortnite k3rn31 -p PC' ]
};
