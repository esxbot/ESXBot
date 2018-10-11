/**
 * @file listWarns command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    if (!message.guild.warns || Object.keys(message.guild.warns).length <= 0) {
      return message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: 'No one has been warned yet.'
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }

    let warnedUsers = [];
    for (let userID of Object.keys(message.guild.warns)) {
      let member = await message.guild.fetchMember(userID).catch((e) => {
        if (e.code !== 10007) {
          ESXBot.log.error(e);
        }
      });
      if (member) {
        warnedUsers.push(`${member.user.tag} - ${message.guild.warns[userID]} Warnings`);
      }
      else {
        // TODO: Remove userID from warn list
      }
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.ORANGE,
        title: 'Warning List',
        description: warnedUsers.length ? warnedUsers.join('\n') : 'No one has been warned yet.'
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
  aliases: [ 'warns' ],
  enabled: true
};

exports.help = {
  name: 'listWarns',
  botPermission: '',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'listWarns',
  example: []
};
