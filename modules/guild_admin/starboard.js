/**
 * @file starboard command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT starboard FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, starboardStats;
    if (guildSettings.starboard) {
      await ESXBot.db.run(`UPDATE guildSettings SET starboard=null WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      starboardStats = ESXBot.strings.info(message.guild.language, 'disableStarboard', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET starboard=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      starboardStats = ESXBot.strings.info(message.guild.language, 'enableStarboard', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: starboardStats
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
  name: 'starboard',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'starboard',
  example: []
};
