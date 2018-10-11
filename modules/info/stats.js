/**
 * @file stats command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let owners = [];
    for (let userID of ESXBot.credentials.ownerId) {
      let user = await ESXBot.fetchUser(userID).catch(() => {});
      owners.push(user.tag);
    }

    let shardStats = ESXBot.shard ? await ESXBot.shard.broadcastEval('this.uptime') : 'None';
    if (shardStats instanceof Array) {
      shardStats = shardStats.length === ESXBot.shard.count ? 'All shards online' : `Launched ${shardStats.length} / ${ESXBot.shard.count} shards`;
    }

    let uptime = ESXBot.shard ? await ESXBot.shard.broadcastEval('this.uptime') : ESXBot.uptime;
    if (uptime instanceof Array) {
      uptime = uptime.reduce((max, cur) => Math.max(max, cur), -Infinity);
    }
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

    let guilds = ESXBot.shard ? await ESXBot.shard.broadcastEval('this.guilds.size') : ESXBot.guilds.size;
    if (guilds instanceof Array) {
      guilds = guilds.reduce((sum, val) => sum + val, 0);
    }
    let textChannels = ESXBot.shard ? await ESXBot.shard.broadcastEval('this.channels.filter(channel => channel.type === \'text\').size') : ESXBot.channels.filter(channel => channel.type === 'text').size;
    if (textChannels instanceof Array) {
      textChannels = textChannels.reduce((sum, val) => sum + val, 0);
    }
    let voiceChannels = ESXBot.shard ? await ESXBot.shard.broadcastEval('this.channels.filter(channel => channel.type === \'voice\').size') : ESXBot.channels.filter(channel => channel.type === 'voice').size;
    if (voiceChannels instanceof Array) {
      voiceChannels = voiceChannels.reduce((sum, val) => sum + val, 0);
    }
    let rss = ESXBot.shard ? await ESXBot.shard.broadcastEval('process.memoryUsage().rss') : process.memoryUsage().rss;
    if (rss instanceof Array) {
      rss = rss.reduce((sum, val) => sum + val, 0);
    }
    let heapUsed = ESXBot.shard ? await ESXBot.shard.broadcastEval('process.memoryUsage().heapUsed') : process.memoryUsage().heapUsed;
    if (heapUsed instanceof Array) {
      heapUsed = heapUsed.reduce((sum, val) => sum + val, 0);
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        author: {
          name: `ESXBot ${ESXBot.package.version}`
        },
        url: ESXBot.package.url,
        fields: [
          {
            name: 'Author',
            value: `[${ESXBot.package.author}](${ESXBot.package.authorUrl})`,
            inline: true
          },
          {
            name: 'BOT ID',
            value: ESXBot.credentials.botId,
            inline: true
          },
          {
            name: `Owner${ESXBot.credentials.ownerId.length > 1 ? 's' : ''}`,
            value: owners.join('\n'),
            inline: true
          },
          {
            name: `Owner ID${ESXBot.credentials.ownerId.length > 1 ? 's' : ''}`,
            value: ESXBot.credentials.ownerId.join('\n'),
            inline: true
          },
          {
            name: 'Default Prefix',
            value: ESXBot.config.prefix,
            inline: true
          },
          {
            name: 'Uptime',
            value: uptime,
            inline: true
          },
          {
            name: 'Shards',
            value: ESXBot.shard ? `${ESXBot.shard.count} Shards` : 'None',
            inline: true
          },
          {
            name: 'Shard Status',
            value: shardStats,
            inline: true
          },
          {
            name: 'Presence',
            value: `${guilds.toHumanString()} Servers\n`
            + `${textChannels.toHumanString()} Text Channels\n`
            + `${voiceChannels.toHumanString()} Voice Channels`,
            inline: true
          },
          {
            name: 'Memory',
            value: `${(rss / 1024 / 1024).toFixed(2)} MB RSS\n`
                   + `${(heapUsed / 1024 / 1024).toFixed(2)} MB Heap`,
            inline: true
          }
        ],
        thumbnail: {
          url: ESXBot.user.displayAvatarURL
        },
        footer: {
          text: `${ESXBot.shard ? `Shard: ${ESXBot.shard.id} • ` : ''}WebSocket PING: ${parseInt(ESXBot.ping)}ms`
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
  aliases: [ 'info' ],
  enabled: true
};

exports.help = {
  name: 'stats',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'stats',
  example: []
};
