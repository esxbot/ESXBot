/**
 * @file kick command
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

    if (!member.kickable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), ESXBot.strings.error(message.guild.language, 'noPermission', true, 'kick', user), message.channel);
    }

    await member.kick(args.reason);

    args.reason = args.reason.join(' ');

    message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        description: ESXBot.strings.info(message.guild.language, 'kick', message.author.tag, user.tag, args.reason),
        footer: {
          text: `ID ${user.id}`
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    ESXBot.emit('moderationLog', message.guild, message.author, this.help.name, member, args.reason);

    member.send({
      embed: {
        color: ESXBot.colors.RED,
        description: ESXBot.strings.info(message.guild.language, 'kickDM', message.author.tag, message.guild.name, args.reason)
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
  aliases: [ 'k' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'kick',
  botPermission: 'KICK_MEMBERS',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'kick <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'kick @user#001 -r Being rude to everyone.', 'kick 167147569575323761 -r Spamming' ]
};
