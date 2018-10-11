/**
 * @file announcementChannel command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let description, color;

    if (args.remove) {
      await ESXBot.db.run(`UPDATE guildSettings SET announcementChannel=null WHERE guildID=${message.guild.id}`);
      description = ESXBot.strings.info(message.guild.language, 'disableAnnouncementChannel', message.author.tag);
      color = ESXBot.colors.RED;
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET announcementChannel='${message.channel.id}' WHERE guildID=${message.guild.id}`);
      description = ESXBot.strings.info(message.guild.language, 'enableAnnouncementChannel', message.author.tag);
      color = ESXBot.colors.GREEN;
    }

    message.channel.send({
      embed: {
        color: color,
        description: description
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
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'announcementChannel',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'announcementChannel [--remove]',
  example: [ 'announcementChannel', 'announcementChannel --remove' ]
};
