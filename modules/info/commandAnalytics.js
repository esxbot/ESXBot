/**
 * @file commandAnalytics command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let mostUsedCommands = Object.keys(message.guild.commandAnalytics);
  mostUsedCommands = mostUsedCommands.slice(0, 10);
  mostUsedCommands = mostUsedCommands.map(command => `\`${command}\` - ${message.guild.commandAnalytics[command]} times`);

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Comandos mais usados neste servidor',
      description: mostUsedCommands.join('\n'),
      footer: {
        text: 'As estatísticas do comando são apagadas após o reinício.'
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'commandStats' ],
  enabled: true
};

exports.help = {
  name: 'commandAnalytics',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commandAnalytics',
  example: []
};
