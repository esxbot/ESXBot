/**
 * @file farewell command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */
// I don't understand why this is even needed, but some fellows like this.

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT farewell FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, farewellStats;
    if (guildSettings.farewell === message.channel.id) {
      await ESXBot.db.run(`UPDATE guildSettings SET farewell=null WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      farewellStats = ESXBot.strings.info(message.guild.language, 'disableFarewellMessages', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET farewell=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      farewellStats = ESXBot.strings.info(message.guild.language, 'enableFarewellMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: farewellStats
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
  name: 'farewell',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewell',
  example: []
};
