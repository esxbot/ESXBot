/**
 * @file live command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let streamers = Array.from(message.guild.presences.filter(p => p.game && p.game.streaming === true).keys());
  message.channel.send({
    embed: {
      color: ESXBot.colors.DARK_PURPLE,
      title: 'Streaming de usuários',
      description: streamers.length > 10 ? `<@${streamers.splice(0, 10).join('>\n<@')}>\nand ${streamers.length - 10} outros estão agora vivos.` : `<@${streamers.join('>\n<@')}>`
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'live',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'live',
  example: []
};
