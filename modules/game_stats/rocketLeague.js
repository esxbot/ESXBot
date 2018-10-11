/**
 * @file rocketLeague command
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

    // If user doesn't provide the platform, default to Steam
    if (!args.platform) {
      args.platform = 'Steam';
    }
    else {
      let platforms = [ 'steam', 'ps4', 'xboxone' ]; // Available platforms for the game
      // If the platform is not valid, return the available platforms
      if (!platforms.includes(args.platform = args.platform.toLowerCase())) {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'invalidPlatform', true, `${platforms.join(', ').toUpperCase()}`), message.channel);
      }
    }

    if (args.platform === 'steam') {
      let options = {
        url: `https://peaceful-celsius.glitch.me/api/${args.player}`,
        json: true
      };

      let { steamID64 } = await request(options);

      args.player = steamID64;
    }

    // eslint-disable-next-line require-jsdoc
    let requestURL = stat_type => `https://api.rocketleague.com/api/v1/${args.platform}/leaderboard/stats/${stat_type}/${args.player}`;
    let endpoints = [
      requestURL('wins'),
      requestURL('goals'),
      requestURL('saves'),
      requestURL('shots'),
      requestURL('mvps'),
      requestURL('assists')
    ];

    let stats = [];
    for (let endpoint of endpoints) {
      let options = {
        url: endpoint,
        headers: {
          'Authorization': `Token ${ESXBot.credentials.rocketLeagueUserToken}`,
          'User-Agent': `ESXBot/${ESXBot.package.version} (${ESXBot.user.tag}; ${ESXBot.user.id}) https://esxbot.github.io`
        },
        json: true
      };

      let stat = await request(options);
      stats.push(stat[0]);
    }

    let fields = stats.map(stat => {
      return {
        name: stat.stat_type.toTitleCase(),
        value: stat.value,
        inline: true
      };
    });

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        author: {
          name: args.player
        },
        title: `Rocket League Stats - ${args.platform.toUpperCase()}`,
        fields: fields,
        thumbnail: {
          url: 'https://vignette.wikia.nocookie.net/rocketleague/images/2/27/Rocket_League_logo.jpg'
        },
        footer: {
          text: 'Powered by Rocket League'
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
    { name: 'player', type: String, defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'Steam' }
  ]
};

exports.help = {
  name: 'rocketLeague',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rocketLeague <PLAYER_ID> [ -p <PLATFORM> ]',
  example: [ 'rocketLeague k3rn31p4nic -p XBoxOne' ]
};
