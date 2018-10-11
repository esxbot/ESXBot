/**
 * @file greet command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT greet FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, greetStats;
    if (guildSettings.greet === message.channel.id) {
      ESXBot.db.run(`UPDATE guildSettings SET greet=null WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      greetStats = ESXBot.strings.info(message.guild.language, 'disableGreetingMessages', message.author.tag);
    }
    else {
      ESXBot.db.run(`UPDATE guildSettings SET greet=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      greetStats = ESXBot.strings.info(message.guild.language, 'enableGreetingMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetStats
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
  name: 'greet',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greet',
  example: []
};
