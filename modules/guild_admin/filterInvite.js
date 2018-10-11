/**
 * @file filterInvite command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, filterInviteStats;
    if (guildSettings.filterInvite) {
      await ESXBot.db.run(`UPDATE guildSettings SET filterInvite=0 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      filterInviteStats = ESXBot.strings.info(message.guild.language, 'disableInviteFilter', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET filterInvite=1 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      filterInviteStats = ESXBot.strings.info(message.guild.language, 'enableInviteFilter', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterInviteStats
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
  aliases: [ 'filterinv' ],
  enabled: true
};

exports.help = {
  name: 'filterInvite',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterInvite',
  example: []
};
