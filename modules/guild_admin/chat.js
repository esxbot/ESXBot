/**
 * @file chat command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, chatStats;
    if (guildSettings.chat) {
      await ESXBot.db.run(`UPDATE guildSettings SET chat=0 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      chatStats = ESXBot.strings.info(message.guild.language, 'disableChat', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET chat=1 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      chatStats = ESXBot.strings.info(message.guild.language, 'enableChat', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: chatStats
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
  name: 'chat',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'chat',
  example: []
};
