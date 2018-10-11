/**
 * @file filterMentionSpam command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    args.amount = Math.abs(args.amount);

    let color, mentionSpamStats;
    if (args.amount) {
      if (args.action && [ 'kick', 'ban' ].includes(args.action = args.action.toLowerCase())) {
        await ESXBot.db.run(`UPDATE guildSettings SET mentionSpamThreshold=${args.amount}, mentionSpamAction='${args.action}' WHERE guildID=${message.guild.id}`);
      }
      else {
        args.action = 'none';
        await ESXBot.db.run(`UPDATE guildSettings SET mentionSpamThreshold=${args.amount}, mentionSpamAction=NULL WHERE guildID=${message.guild.id}`);
      }

      color = ESXBot.colors.GREEN;
      mentionSpamStats = ESXBot.strings.info(message.guild.language, 'enableMentionSpamFilter', message.author.tag, args.amount, args.action);
    }
    else {
      await ESXBot.db.run(`UPDATE guildSettings SET mentionSpamThreshold=NULL, mentionSpamAction=NULL WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      mentionSpamStats = ESXBot.strings.info(message.guild.language, 'disableMentionSpamFilter', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: mentionSpamStats
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
    { name: 'amount', type: Number, defaultOption: true },
    { name: 'action', type: String, alias: 'a' }
  ]
};

exports.help = {
  name: 'filterMentionSpam',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterMentionSpam [ MENTION_THRESHOLD [ --action KICK|BAN ] ]',
  example: [ 'filterMentionSpam 5', 'filterMentionSpam 5 --action kick', 'filterMentionSpam' ]
};
