/**
 * @file contributors command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let contributors = await ESXBot.functions.getContributors();
    contributors = contributors.map(contributor => `${contributor.username} - ${contributor.contributions} contributions`);

    let noOfPages = contributors.length / 25;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: 10181046,
        description: 'Estas são as pessoas que contribuem para o desenvolvimento do ESXBot em [GitHub](https://github.com/esxbot/ESXBot).',
        fields: [
          {
            name: 'Colaboradores',
            value: contributors.slice(i * 25, (i * 25) + 25).join('\n')
          }
        ],
        footer: {
          text: `Página: ${i + 1} de ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)} • https://github.com/esxbot/ESXBot`
        }
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
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'contributors',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'contributors',
  example: []
};
