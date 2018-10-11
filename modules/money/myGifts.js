/**
 * @file myGifts command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let gifts = {
      chocolate_bar: [ '🍫  Barra de chocolate', 20 ],
      icecream: [ '🍦  Sorvete', 10 ],
      cookie: [ '🍪  Biscoito', 5 ],
      cake: [ '🍰  Bolo', 20 ],
      ring: [ '💍  Anel', 250 ],
      crown: [ '👑  Coroa', 500 ],
      gem: [ '💎  Gema', 100 ],
      gift_heart: [ '💝  Coração', 50 ],
      love_letter: [ '💌  Carta de amor', 5 ]
    };

    let color, title, description, giftsField = [];
    let userGifts = await ESXBot.db.get(`SELECT * FROM gifts WHERE userID='${message.author.id}'`);
    if (!userGifts) {
      color = ESXBot.colors.RED;
      title = 'Não encontrado';
      description = 'Não encontrado Parece que você ainda não recebeu nenhum presente!\nNão fique chateado, aqui está um presente meu :gift:';
    }
    else {
      color = ESXBot.colors.BLUE;
      title = `Presentes com ${message.author.tag}`;
      for (let gift of Object.keys(gifts)) {
        giftsField.push({
          name: `${gifts[gift][0]}s`,
          value: userGifts[`${gift}s`] || 0,
          inline: true
        });
      }
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
        description: description,
        fields: giftsField
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
  enabled: true
};

exports.help = {
  name: 'myGifts',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'myGifts',
  example: []
};
