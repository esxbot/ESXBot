/**
 * @file unMute command
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

    args.reason = args.reason.join(' ');

    await member.setMute(false);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: ESXBot.strings.info(message.guild.language, 'voiceUnmute', message.author.tag, user.tag, args.reason)
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    ESXBot.emit('moderationLog', message.guild, message.author, this.help.name, user, args.reason);
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'unMute',
  botPermission: 'MUTE_MEMBERS',
  userTextPermission: 'MUTE_MEMBERS',
  userVoicePermission: '',
  usage: 'unMute <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'unMute @user#001 -r Apologized', 'unMute 167147569575323761 -r Forgiven' ]
};
