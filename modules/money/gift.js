/**
 * @file gift command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let receiver = message.mentions.users.first();
    if (!args.product || !receiver) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    if (/choco(?:late)?[-_ ]?(?:bar)?[s]?/i.test(args.product)) {
      args.product = 'chocolate_bar';
    }
    else if (/ice[-_ ]?cream[s]?/i.test(args.product)) {
      args.product = 'icecream';
    }
    else if (/cookie[s]?/i.test(args.product)) {
      args.product = 'cookie';
    }
    else if (/cake[s]?/i.test(args.product)) {
      args.product = 'cake';
    }
    else if (/ring[s]?/i.test(args.product)) {
      args.product = 'ring';
    }
    else if (/crown[s]?/i.test(args.product)) {
      args.product = 'crown';
    }
    else if (/gem[s]?/i.test(args.product)) {
      args.product = 'gem';
    }
    else if (/heart[s]?/i.test(args.product)) {
      args.product = 'gift_heart';
    }
    else if (/love[-_ ]?letter[s]?/i.test(args.product)) {
      args.product = 'love_letter';
    }
    else {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), 'O produto especificado não foi encontrado na loja de presentes. Para verificar os produtos disponíveis, execute comando `giftShop`.', message.channel);
    }

    args.amount = Math.abs(args.amount);

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

    // Check sender's gifts
    let senderGifts = await ESXBot.db.get(`SELECT ${args.product}s FROM gifts WHERE userID='${message.author.id}'`);
    if (!senderGifts) {
      return ESXBot.emit('error', 'Itens insuficientes', 'Você não tem nenhum presente com você.', message.channel);
    }
    else if (!senderGifts[`${args.product}s`]) {
      return ESXBot.emit('error', 'Itens insuficientes', `Você não tem nenhum ${gifts[args.product][0]} contigo.`, message.channel);
    }

    let giftAmount = parseInt(senderGifts[`${args.product}s`]);
    if (giftAmount < args.amount) {
      return ESXBot.emit('error', 'Itens insuficientes', `Você só tem ${giftAmount} ${gifts[args.product][0]}`, message.channel);
    }

    // Update receiver's gifts
    let receiverGifts = await ESXBot.db.get(`SELECT ${args.product}s FROM gifts WHERE userID='${receiver.id}'`);
    if (!receiverGifts) {
      await ESXBot.db.run(`INSERT OR IGNORE INTO gifts(userID, ${args.product}s) VALUES(${receiver.id}, ${args.amount})`);
    }
    else if (!receiverGifts[`${args.product}s`]) {
      await ESXBot.db.run(`UPDATE gifts SET ${args.product}s='${args.amount}' WHERE userID='${receiver.id}'`);
    }
    else {
      await ESXBot.db.run(`UPDATE gifts SET ${args.product}s='${parseInt(receiverGifts[`${args.product}s`]) + args.amount}' WHERE userID='${receiver.id}'`);
    }

    // Update sender's gifts
    await ESXBot.db.run(`UPDATE gifts SET ${args.product}s='${giftAmount - args.amount}' WHERE userID='${message.author.id}'`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        description: `${receiver.tag}, você recebeu ${args.amount} ${gifts[args.product][0]} por ${message.author.tag}!`
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
    { name: 'product', type: String, multiple: true, defaultOption: true },
    { name: 'amount', type: Number, alias: 'a', defaultValue: 1 }
  ]
};

exports.help = {
  name: 'gift',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'gift <product> [-a amount] <@USER_MENTION>',
  example: [ 'gift icecream @user#0001', 'gift chocolate -a 2 @user#0001' ]
};
