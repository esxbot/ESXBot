/**
 * @file filterWord command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT filterWord FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, filterWordStats;
    if (guildSettings.filterWord) {
      await ESXBot.db.run(`UPDATE guildSettings SET filterWord=0 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      filterWordStats = ESXBot.strings.info(message.guild.language, 'disableWordFilter', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET filterWord=1 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      filterWordStats = ESXBot.strings.info(message.guild.language, 'enableWordFilter', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterWordStats
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
  name: 'filterWord',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterWord',
  example: []
};
