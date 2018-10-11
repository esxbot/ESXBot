/**
 * @file changelog command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  const CHANGES = require('../../changes.json');

  let changes = [];
  for (let section in CHANGES) {
    if (CHANGES.hasOwnProperty(section)) {
      if (section === 'date' || section === 'image' || !CHANGES[section].length) continue;

      changes.push({
        name: section,
        value: `- ${CHANGES[section].join('\n- ')}`
      });
    }
  }

  changes.push(
    {
      name: '\u200B',
      value: '\u200B'
    },
    /*{
      name: 'Missed an update?',
      value: '[Check out our previous change logs](https://github.com/esxbot/ESXBot/releases).'
        + '\nJoin **ESXBot HQ** and never miss an update: https://discord.gg/8zGbh3T'
    },*/
    {
      name: 'Amando ESXBot?',
      value: 'Então por que esperar? Vá em frente e expresse seus sentimentos twitando nele em [@renildomarcio](https://twitter.com/renildomarcio) e seu depoimento será postado em [nossa página de depoimentos](https://esxbot.github.io/testimonials).'
    },
    {
      name: 'Suporte ao desenvolvimento do ESXBot',
      value: '[Apoie o desenvolvimento do ESXBot](https://esxbot.github.io/donate) para mantê-lo funcionando para sempre e obter recompensas legais!'
    }
  );

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: `ESXBot v${ESXBot.package.version} Changelog`,
      url: `https://esxbot.github.io/changelog/${ESXBot.package.version}`,
      fields: changes,
      image: {
        url: CHANGES.image
      },
      footer: {
        text: CHANGES.date
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'clog', 'changes' ],
  enabled: true
};

exports.help = {
  name: 'changelog',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'changelog',
  example: []
};
