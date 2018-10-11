/**
 * @file callOfDutyModernWarfare3 command
 * @author Renildo Marcio (KR Soluções Web)
 * @license GPL-3.0
 */

const source = require('gamedig');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(args.address)) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args.address = args.address.split(':');
    let host = args.address[0];

    if (host === '127.0.0.1') {
      return message.channel.send({
        embed: {
          description: 'There is no place like `127.0.0.1`'
        }
      });
    }

    let port;
    if (args.address[1]) {
      port = parseInt(args.address[1]);
    }
    else {
      port = 27015;
    }

    let data = await source.query({
      type: 'codmw3',
      host: host,
      port: port
    });

    let stats = [
      {
        name: 'Server IP',
        value: `\`${host}:${port}\``,
        inline: true
      },
      {
        name: 'Players',
        value: `${data.players.length}/${data.maxplayers}`,
        inline: true
      },
      {
        name: 'Map',
        value: data.map
      }
    ];

    if (data.players.length > 0) {
      let players = [];
      let scores = [];
      let playtimes = [];
      for (let i = 0; i < data.players.length; i++) {
        players.push(data.players[i].name);
      }
      for (let i = 0; i < data.players.length; i++) {
        scores.push(data.players[i].score);
      }
      for (let i = 0; i < data.players.length; i++) {
        playtimes.push(`${parseInt(data.players[i].time)}s`);
      }
      stats.push(
        {
          name: 'Player',
          value: `\`\`\`http\n${players.join('\n')}\`\`\``,
          inline: true
        },
        {
          name: 'Score',
          value: `\`\`\`http\n${scores.join('\n')}\`\`\``,
          inline: true
        },
        {
          name: 'Playtime',
          value: `\`\`\`http\n${playtimes.join('\n')}\`\`\``,
          inline: true
        },
        {
          name: 'Join',
          value: `<steam://connect/${host}:${port}>`
        }
      );
    }

    let footer;
    if (data.password) {
      footer = {
        text: 'Private Server',
        icon_url: 'https://resources-esx.github.io/images/lock.png'
      };
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: data.name,
        description: '[Call of Duty: Modern Warfare 3](https://store.steampowered.com/app/42690/)',
        fields: stats,
        footer: footer
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.toString() === 'UDP Watchdog Timeout') {
      return ESXBot.emit('error', '', ESXBot.strings.error(message.guild.language, 'invalidIPPort'), message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'codmw3' ],
  enabled: true,
  argsDefinitions: [
    { name: 'address', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'callOfDutyModernWarfare3',
  description: 'Get stats of any Call of Duty: Modern Warfare 3 game server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'callOfDutyModernWarfare3 <CODMW3_SERVER_IP:PORT>',
  example: [ 'callOfDutyModernWarfare3 139.59.31.129:27019' ]
};
