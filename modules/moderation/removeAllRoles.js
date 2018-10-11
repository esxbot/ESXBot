/**
 * @file removeAllRoles command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.id) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await message.guild.fetchMember(args.id);
      if (user) {
        user = user.user;
      }
    }
    if (!user) {
      user = message.author;
    }

    let member = await message.guild.fetchMember(user.id);
    if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return ESXBot.log.info(ESXBot.strings.error(message.guild.language, 'lowerRole', true));

    await member.removeRoles(member.roles);

    message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        description: ESXBot.strings.info(message.guild.language, 'removeAllRoles', message.author.tag, user.tag)
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    ESXBot.emit('moderationLog', message.guild, message.author, this.help.name, user);
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'removeallr' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'removeAllRoles',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'removeAllRoles [ @USER_MENTION | USER_ID ]',
  example: [ 'removeAllRoles @user#0001', 'removeAllRoles 282424753565461211', 'removeAllRoles' ]
};
