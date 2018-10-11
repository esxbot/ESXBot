/**
 * @file donate command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.DARK_GREEN,
      title: 'Apoie o desenvolvimento do ESXBot',
      url: 'https://esxbot.github.io/donate',
      description: '**Compartilhe sua apreciação e receba recompensas legais!**' +
                   '\nDoe para apoiar o desenvolvimento do ESXBot e mantê-lo funcionando para sempre.' +
                   '\n\nVocê pode doar através dos métodos abaixo e obter as recompensas mencionadas em nossos níveis Patreon.',
      fields: [
        {
          name: 'Patreon',
          value: 'Você pode prometer o Projeto ESXBot no Patreon:'
                + '\nhttps://patreon.com/esxbot'
        },
        {
          name: 'PayPal',
          value: 'Você pode enviar doações via PayPal:'
                + '\nEm breve!!'
        },
        {
          name: 'Cryptocurrencies',
          value: 'Você pode enviar doações com Cryptocurrencies:'
                + '\nEm breve!!'
        }
      ],
      footer: {
        text: 'If everyone using ESXBot gave $1, we could keep ESXBot thriving for months to come.'
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: ['doar', 'doacao'],
  enabled: true
};

exports.help = {
  name: 'donate',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'donate',
  example: []
};
