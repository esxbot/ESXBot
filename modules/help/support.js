/**
 * @file support command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.GOLD,
      title: 'ESXBot HQ',
      url: 'https://discord.gg/8zGbh3T',
      description: 'Precisa de ajuda ou suporte com o ESXBot Discord Bot?\nJunte-se ao Servidor de Suporte ESXBot para qualquer ajuda que você precisar.\nhttps://discord.gg/8zGbh3T',
      fields: [
        {
          name: 'Website',
          value: 'https://esxbot.github.io/'
        }
      ]
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ss', 'suporte' ],
  enabled: true
};

exports.help = {
  name: 'support',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'support',
  example: []
};
