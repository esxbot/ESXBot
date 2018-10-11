/**
 * @file levelUpMessage command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, levelUpMessageStats;
    if (guildSettings.levelUpMessage) {
      await ESXBot.db.run(`UPDATE guildSettings SET levelUpMessage=0 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      levelUpMessageStats = ESXBot.strings.info(message.guild.language, 'disableLevelUpMessages', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET levelUpMessage=1 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      levelUpMessageStats = ESXBot.strings.info(message.guild.language, 'enableLevelUpMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: levelUpMessageStats
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
  aliases: [ 'lvlupmsg' ],
  enabled: true
};

exports.help = {
  name: 'levelUpMessage',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'levelUpMessage',
  example: []
};
