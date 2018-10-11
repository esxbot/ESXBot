/**
 * @file ignoreChannel command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT ignoredChannels FROM guildSettings WHERE guildID=${message.guild.id}`);
    let ignoredChannels = guildSettings.ignoredChannels, isIgnored = false,
      description = null, color = ESXBot.colors.RED;

    if (ignoredChannels) {
      ignoredChannels = ignoredChannels.split(' ');
      if (ignoredChannels.includes(message.channel.id)) {
        isIgnored = true;
      }
    }
    else {
      ignoredChannels = [];
    }

    if (isIgnored) {
      if (args.remove) {
        ignoredChannels.splice(ignoredChannels.indexOf(message.channel.id), 1);
        color = ESXBot.colors.GREEN;
        description = 'I\'ll stop ignoring commands in this channel, from now.';
      }
      else {
        description = 'I\'m already ignoring commands in this channel.';
      }
    }
    else {
      if (args.remove) {
        description = 'I\'m already accepting commands in this channel.';
      }
      else {
        ignoredChannels.push(message.channel.id);
        color = ESXBot.colors.GREEN;
        description = 'I\'ll ignore commands in this channel, from now.';
      }
    }
    ignoredChannels = ignoredChannels.join(' ');

    await ESXBot.db.run(`UPDATE guildSettings SET ignoredChannels='${ignoredChannels}' WHERE guildID=${message.guild.id}`);

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
  name: 'ignoreChannel',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'ignoreChannel [--remove]',
  example: [ 'ignoreChannel', 'ignoreChannel --remove' ]
};
