/**
 * @file level command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let profile = await ESXBot.db.get(`SELECT level FROM profiles WHERE userID=${args.id}`), level = 0;

    if (profile && profile.level) {
      level = profile.level;
    }

    let description = message.author.id === args.id ? `**${args.tag}** você está atualmente no nível **${level}**.` : `**${args.tag}** está atualmente no nível **${level}**.`;

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
  aliases: [ 'lvl' ],
  enabled: true
};

exports.help = {
  name: 'level',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'level [@user-mention]',
  example: [ 'level', 'level @user#0001' ]
};
