/**
 * @file xp command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let profile = await ESXBot.db.get(`SELECT xp FROM profiles WHERE userID=${args.id}`), xp = 0;

    if (profile && profile.xp) {
      xp = profile.xp;
    }

    let description = message.author.id === args.id ? `**${args.tag}** you have **${xp}** experience points.` : `**${args.tag}** has **${xp}** experience points.`;

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
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
  enabled: true
};

exports.help = {
  name: 'xp',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'xp [@user-mention]',
  example: [ 'xp', 'xp @user#0001' ]
};
