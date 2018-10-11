/**
 * @file shardStats command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  try {
    if (!ESXBot.shard) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidUse'), 'ESXBot is not sharded. Run ESXBot using the sharding manager.', message.channel);
    }

    let uptime = ESXBot.uptime;
    let seconds = uptime / 1000;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    uptime = `${seconds}s`;
    if (days) {
      uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    else if (hours) {
      uptime = `${hours}h ${minutes}m ${seconds}s`;
    }
    else if (minutes) {
      uptime = `${minutes}m ${seconds}s`;
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Shard Stats',
        url: ESXBot.package.url,
        fields: [
          {
            name: 'Shard ID',
            value: ESXBot.shard.id,
            inline: true
          },
          {
            name: 'Uptime',
            value: uptime,
            inline: true
          },
          {
            name: 'WebSocket PING',
            value: `${ESXBot.ping.toFixed(2)}ms`,
            inline: true
          },
          {
            name: 'Presence',
            value: `${ESXBot.guilds.size.toHumanString()} Servers\n`
            + `${ESXBot.channels.filter(channel => channel.type === 'text').size.toHumanString()} Text Channels\n`
            + `${ESXBot.channels.filter(channel => channel.type === 'voice').size.toHumanString()} Voice Channels`,
            inline: true
          },
          {
            name: 'Memory',
            value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n`
                   + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap`,
            inline: true
          }
        ],
        footer: {
          text: `Total Shards: ${ESXBot.shard.count}`
        },
        timestamp: new Date()
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
  aliases: [ 'shard' ],
  enabled: true
};

exports.help = {
  name: 'shardStats',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shardStats',
  example: []
};
