/**
 * @file ping command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let responseMessage = await message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        description: 'PINGING...'
      }
    });
    await responseMessage.edit({
      embed: {
        color: ESXBot.colors.BLUE,
        title: `${ESXBot.user.username} Estatísticas do PING`,
        fields: [
          {
            name: 'Tempo de resposta',
            value: `${responseMessage.createdTimestamp - message.createdTimestamp}ms`,
            inline: true
          },
          {
            name: 'WebSocket PING',
            value: `${ESXBot.ping}ms`,
            inline: true
          }
        ]
      }
    });
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
  name: 'ping',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'ping',
  example: []
};
