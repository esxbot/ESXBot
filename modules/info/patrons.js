/**
 * @file patrons command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let patrons = await ESXBot.functions.getPatrons();
    patrons = patrons.filter(patron => !patron.declined_since).map(patron => patron.full_name);

    let noOfPages = patrons.length / 50;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    let description;
    if (ESXBot.user.id === '290205363414892545') {
      description = 'Essas são as pessoas incríveis que apoiam continuamente o desenvolvimento do projeto do bot de ESX, sendo meu patrono, [Patreon](https://patreon.com/esxbot).\nSe você quiser apoiar o desenvolvimento do ESX também, [seja meu Patrono](https://patreon.com/)';
    }
    else {
      description = 'Estas são as pessoas maravilhosas que continuamente nos apóiam, sendo nosso patrono no Patreon.';
    }

    message.channel.send({
      embed: {
        color: 16345172,
        description: description,
        fields: [
          {
            name: 'Patrons',
            value: patrons.slice(i * 50, (i * 50) + 50).join(', ')
          }
        ],
        footer: {
          text: `Página: ${i + 1} de ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      if (e.response.body && e.response.body.errors.length) {
        return ESXBot.emit('error', `${e.response.statusCode} - ${e.response.statusMessage}`, e.response.body.errors[0].detail, message.channel);
      }
      return ESXBot.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
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
  name: 'patrons',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'patrons',
  example: []
};
