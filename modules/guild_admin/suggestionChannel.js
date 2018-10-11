/**
 * @file suggestionChannel command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT suggestionChannel FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, suggestionChannelStats;
    if (guildSettings.suggestionChannel) {
      await ESXBot.db.run(`UPDATE guildSettings SET suggestionChannel=null WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      suggestionChannelStats = ESXBot.strings.info(message.guild.language, 'disableSuggestionChannel', message.author.tag);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET suggestionChannel=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.GREEN;
      suggestionChannelStats = ESXBot.strings.info(message.guild.language, 'enableSuggestionChannel', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: suggestionChannelStats
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
  name: 'suggestionChannel',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'suggestionChannel',
  example: []
};
