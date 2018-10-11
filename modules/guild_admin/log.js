/**
 * @file log command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT log FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, logStats;
    if (guildSettings.log) {
      await ESXBot.db.run(`UPDATE guildSettings SET log=null WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      logStats = ESXBot.strings.info(message.guild.language, 'disableServerLog', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET log=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      logStats = ESXBot.strings.info(message.guild.language, 'enableServerLog', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: logStats
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
  enabled: true
};

exports.help = {
  name: 'log',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'log',
  example: []
};
