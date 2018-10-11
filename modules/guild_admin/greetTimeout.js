/**
 * @file greetTimeout command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!/^(([0-2]?[0-9]?[0-9])|300)$/.test(args[0])) {
      args[0] = '0';
    }
    await ESXBot.db.run(`UPDATE guildSettings SET greetTimeout=${args[0]} WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Greet Timeout set to:',
        description: args[0] > 60 ? `${args[0] / 60} min.` : args[0] === 0 ? '∞' : `${args[0]} sec.`
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
  aliases: [ 'gtout' ],
  enabled: true
};

exports.help = {
  name: 'greetTimeout',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetTimeout [time_in_seconds]',
  example: [ 'greetTimeout 120', 'greetTimeout' ]
};
