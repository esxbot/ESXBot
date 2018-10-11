/**
 * @file filterLink command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT filterLink FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, filterLinkStats;
    if (guildSettings.filterLink) {
      await ESXBot.db.run(`UPDATE guildSettings SET filterLink=0 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      filterLinkStats = ESXBot.strings.info(message.guild.language, 'disableLinkFilter', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET filterLink=1 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      filterLinkStats = ESXBot.strings.info(message.guild.language, 'enableLinkFilter', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterLinkStats
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
  name: 'filterLink',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterLink',
  example: []
};
