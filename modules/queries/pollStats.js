/**
 * @file pollStats command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  if (message.channel.poll && message.channel.poll.collector) {
    let pollRes = message.channel.poll.collector.collected;
    let pollMessage = message.channel.poll.message;

    pollRes = pollRes.map(r => r.content);
    pollRes = pollRes.filter(res => parseInt(res) && parseInt(res) > 0 && parseInt(res) < pollMessage.length);
    if (pollRes.length === 0) {
      return message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          title: 'Status da Enquete',
          description: 'Nenhum voto foi dado ainda. Você pode votar enviando o número correspondente da opção.'
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }

    for (let i = pollMessage.length - 1; i > 0; i--) {
      pollRes.unshift(i);
    }
    let count = {};
    for (let i = 0; i < pollRes.length; i++) {
      count[pollRes[i]] = count[pollRes[i]] ? count[pollRes[i]] + 1 : 1;
    }
    let result = [];
    let totalVotes = (pollRes.length - (pollMessage.length - 1));
    for (let i = 1; i < pollMessage.length; i++) {
      let numOfVotes = count[Object.keys(count)[i - 1]] - 1;
      result.push({
        name: pollMessage[i],
        value: `${(numOfVotes / totalVotes) * 100}% (${numOfVotes} of ${totalVotes})`,
        inline: true
      });
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Status da Enquete',
        description: `Resultados da enquete para **${pollMessage[0]}**`,
        fields: result
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'pollStats',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pollStats',
  example: []
};
