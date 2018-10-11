/**
 * @file modLog command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

// This feature is absolutely useless because Discord already has audit logs. I'll probably remove this in future.

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT modLog FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, modLogStats;
    if (guildSettings.modLog) {
      await ESXBot.db.run(`UPDATE guildSettings SET modLog=null WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      modLogStats = ESXBot.strings.info(message.guild.language, 'disableModerationLog', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET modLog=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      modLogStats = ESXBot.strings.info(message.guild.language, 'enableModerationLog', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: modLogStats
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
  name: 'modLog',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'modLog',
  example: []
};
