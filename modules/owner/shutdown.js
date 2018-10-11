/**
 * @file shutdown command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let confirmation = await message.channel.send({
      embed: {
        color: ESXBot.colors.ORANGE,
        description: 'Are you sure you want to shut me down?'
      }
    });

    const collector = confirmation.channel.createMessageCollector(m => ESXBot.credentials.ownerId.includes(m.author.id) && (m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no')),
      {
        time: 30 * 1000,
        maxMatches: 1
      }
    );

    collector.on('collect', async answer => {
      try {
        if (answer.content.toLowerCase().startsWith('yes')) {
          await message.channel.send({
            embed: {
              description: 'GoodBye :wave:! See you soon.'
            }
          });

          if (ESXBot.shard) {
            await ESXBot.shard.broadcastEval('this.destroy().then(() => process.exitCode = 0)');
          }
          else {
            await ESXBot.destroy();
            process.exitCode = 0;
            setTimeout(() => {
              process.exit(0);
            }, 5000);
          }

          ESXBot.log.console('\n');
          ESXBot.log.info('GoodBye! See you next time.');
        }
        else {
          await message.channel.send({
            embed: {
              description: 'Cool! I\'m here.'
            }
          });
        }
      }
      catch (e) {
        ESXBot.log.error(e);
      }
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'die', 'turnoff' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'shutdown',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shutdown',
  example: []
};
