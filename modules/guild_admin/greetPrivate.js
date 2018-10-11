/**
 * @file greetPrivate command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT greetPrivate FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, greetPrivateStats;
    if (guildSettings.greetPrivate) {
      await ESXBot.db.run(`UPDATE guildSettings SET greetPrivate=0 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      greetPrivateStats = ESXBot.strings.info(message.guild.language, 'disablePrivateGreetingMessages', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET greetPrivate=1 WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      greetPrivateStats = ESXBot.strings.info(message.guild.language, 'enablePrivateGreetingMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetPrivateStats
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
  aliases: [ 'greetprv' ],
  enabled: true
};

exports.help = {
  name: 'greetPrivate',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetPrivate',
  example: []
};
