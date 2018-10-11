/**
 * @file slowMode command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT slowMode FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, slowModeStats;
    if (guildSettings.slowMode) {
      await ESXBot.db.run(`UPDATE guildSettings SET slowMode=0 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      slowModeStats = ESXBot.strings.info(message.guild.language, 'disableSlowMode', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET slowMode=1 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      slowModeStats = ESXBot.strings.info(message.guild.language, 'enableSlowMode', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: slowModeStats
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
  name: 'slowMode',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'slowMode',
  example: []
};
