/**
 * @file report command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 2) {
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
    else if (args[0]) {
      user = await ESXBot.fetchUser(args[0]);
    }
    if (!user) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    if (message.author.id === user.id) return;

    let reason = args.slice(1).join(' ');
    if (reason.length < 1) {
      reason = 'No reason given';
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'User Reported',
        description: ESXBot.strings.info(message.guild.language, 'report', message.author.tag, user.tag, reason)
      }
    }).then(reportMessage => {
      message.delete().catch(() => {});
      reportMessage.delete(5000).catch(() => {});
    }).catch(e => {
      ESXBot.log.error(e);
    });

    /**
     * Logs moderation events if it is enabled
     * @fires moderationLog
     */
    ESXBot.emit('moderationLog', message.guild, message.author, this.help.name, user, reason);
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
  name: 'report',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'report < @USER_MENTION | USER_ID > <REASON >',
  example: [ 'report 215052539542571701 Reason for reporting.', 'report @user#0001 Reason for reporting.' ]
};
