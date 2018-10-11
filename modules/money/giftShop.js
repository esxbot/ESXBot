/**
 * @file giftShop command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let gifts = {
    chocolate_bar: [ '🍫  Barra de chocolate', 20 ],
    icecream: [ '🍦  Sorvete', 10 ],
    cookie: [ '🍪  Biscoito', 5 ],
    cake: [ '🍰  Anel', 20 ],
    ring: [ '💍  Anel', 250 ],
    crown: [ '👑  Coroa', 500 ],
    gem: [ '💎  Gema', 100 ],
    gift_heart: [ '💝  Coração', 50 ],
    love_letter: [ '💌  Carta de amor', 5 ]
  };

  let giftsField = [];
  for (let gift of Object.values(gifts)) {
    giftsField.push({
      name: gift[0],
      value: `${gift[1]} BC cada`,
      inline: true
    });
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Loja de presentes',
      fields: giftsField,
      footer: {
        text: 'BC: ESXBot Moeda'
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'giftShop',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'giftShop',
  example: []
};
