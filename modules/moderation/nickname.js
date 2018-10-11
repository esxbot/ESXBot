/**
 * @file nickname command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await ESXBot.fetchUser(args.id);
    }
    if (!user) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let member = await message.guild.fetchMember(user.id);
    if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return ESXBot.log.info(ESXBot.strings.error(message.guild.language, 'lowerRole', true));

    let color;
    let nickStat = '';
    if (message.guild.ownerID === message.author.id) {
      color = ESXBot.colors.RED;
      nickStat = 'Can\'t change server owner\'s nickname.';
    }
    else {
      args.nick = args.nick.join(' ');

      if (args.nick > 32) {
        color = ESXBot.colors.RED;
        nickStat = 'Nickname can\'t be longer than 32 characters.';
      }
      else {
        if (args.nick < 1) {
          color = ESXBot.colors.RED;
          nickStat = ESXBot.strings.info(message.guild.language, 'removeNickname', message.author.tag, user.tag);
        }
        else {
          color = ESXBot.colors.GREEN;
          nickStat = ESXBot.strings.info(message.guild.language, 'setNickname', message.author.tag, user.tag, args.nick);
        }
      }
      await member.setNickname(args.nick);
    }

    message.channel.send({
      embed: {
        color: color,
        description: nickStat
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
  aliases: [ 'nick' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'nick', alias: 'n', type: String, multiple: true, defaultValue: [] }
  ]
};

exports.help = {
  name: 'nickname',
  botPermission: 'MANAGE_NICKNAMES',
  userTextPermission: 'MANAGE_NICKNAMES',
  userVoicePermission: '',
  usage: 'nickname < @USER_MENTION | USER_ID > [-n nick]',
  example: [ 'nickname @user#0001 -n The Legend', 'nickname 167147569575323761' ]
};
