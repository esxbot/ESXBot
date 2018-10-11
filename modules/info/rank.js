/**
 * @file rank command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;
    let profile = await ESXBot.db.get(`SELECT (SELECT COUNT(*) FROM profiles) AS total, (SELECT COUNT(*) FROM profiles AS p2 WHERE p2.xp * 1 > p1.xp * 1) AS rank FROM profiles as p1 WHERE p1.userID=${args.id}`), rank = 0;

    if (profile && profile.hasOwnProperty('rank')) {
      rank = parseInt(profile.rank) + 1;
    }

    let description = message.author.id === args.id ? `**${args.tag}** sua classificação é **${rank}** de ${profile.total}.` : `**${args.tag}** classificação é **${rank}** de ${profile.total}.`;

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
  name: 'rank',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rank [@user-mention]',
  example: [ 'rank', 'rank @user#0001' ]
};
