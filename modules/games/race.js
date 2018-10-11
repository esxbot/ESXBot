/**
 * @file race command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const ProgressBar = require('../../utils/progress');

exports.exec = async (ESXBot, message) => {
  try {
    let racers = [ [], [] ];
    const STEPS = 20;
    for (let i = 0; i < racers.length; i++) {
      racers[i].length = STEPS;
      for (let j = 0; j < STEPS; j++) {
        racers[i][j] = '-\u2003';
      }
    }

    const esxbot = new ProgressBar(':bar', {
      incomplete: '-\u2003',
      complete: '-\u2003',
      head: '\u2003‣\u2003',
      total: 20
    });
    const racer = new ProgressBar(':bar', {
      incomplete: '-\u2003',
      complete: '-\u2003',
      head: '\u2003‣\u2003',
      total: 20
    });

    let raceStatusMessage = await message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Race',
        fields: [
          {
            name: ESXBot.user.tag,
            value: `:vertical_traffic_light: ${racers[0].join('')}:checkered_flag:`
          },
          {
            name: message.author.tag,
            value: `:vertical_traffic_light: ${racers[1].join('')}:checkered_flag:`
          }
        ]
      }
    });

    let timer = setInterval(() => {
      for (let i = 0; i < Math.floor(Math.random() * (5 - 1 + 1) + 1); i++) {
        racer.tick();
      }
      for (let i = 0; i < Math.floor(Math.random() * (5 - 1 + 1) + 1); i++) {
        esxbot.tick();
      }

      if (esxbot.lastDraw) {
        let result = 'Race ',
          progressESXBot = `:vertical_traffic_light: ${esxbot.lastDraw}:checkered_flag:`,
          progressRacer = `:vertical_traffic_light: ${racer.lastDraw}:checkered_flag:`;
        if (esxbot.complete && !racer.complete) {
          result += 'Ended';
          progressESXBot = `:vertical_traffic_light: ${esxbot.lastDraw}:checkered_flag: :trophy:`;
        }
        else if (!esxbot.complete && racer.complete) {
          result += 'Ended';
          progressRacer = `:vertical_traffic_light: ${racer.lastDraw}:checkered_flag: :trophy:`;
        }
        else if (esxbot.complete && racer.complete) {
          result += 'Ended - Draw';
        }
        raceStatusMessage.edit({
          embed: {
            color: ESXBot.colors.BLUE,
            title: result,
            fields: [
              {
                name: ESXBot.user.tag,
                value: progressESXBot
              },
              {
                name: message.author.tag,
                value: progressRacer
              }
            ]
          }
        }).catch(e => {
          ESXBot.log.error(e);
        });
      }
      if (esxbot.complete || racer.complete) {
        clearInterval(timer);
      }
    }, 1000);
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
  name: 'race',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'race',
  example: [ 'race' ]
};
