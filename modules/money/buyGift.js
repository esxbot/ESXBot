/**
 * @file buyGift command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.product) {
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
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), 'O produto especificado não foi encontrado na loja de presentes. Para verificar os produtos disponíveis, execute o comando `giftShop`.', message.channel);
    }

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

    let userProfile = await ESXBot.db.get(`SELECT esxbotCurrencies FROM profiles WHERE userID='${message.author.id}'`);
    let userBalance = parseInt(userProfile.esxbotCurrencies);
    let requiredBalance = gifts[args.product][1] * args.amount;

    if (userBalance < requiredBalance) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'insufficientBalance'), ESXBot.strings.error(message.guild.language, 'insufficientBalance', true, userBalance), message.channel);
    }

    ESXBot.emit('userCredit', message.author, requiredBalance);

    let userGifts = await ESXBot.db.get(`SELECT ${args.product}s FROM gifts WHERE userID='${message.author.id}'`);
    if (!userGifts) {
      await ESXBot.db.run(`INSERT OR IGNORE INTO gifts(userID, ${args.product}s) VALUES(${message.author.id}, ${args.amount})`);
    }
    else if (!userGifts[`${args.product}s`]) {
      await ESXBot.db.run(`UPDATE gifts SET ${args.product}s='${args.amount}' WHERE userID='${message.author.id}'`);
    }
    else {
      await ESXBot.db.run(`UPDATE gifts SET ${args.product}s='${parseInt(userGifts[`${args.product}s`]) + args.amount}' WHERE userID='${message.author.id}'`);
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: `${message.author.tag}, you successfully bought ${args.amount} ${gifts[args.product][0]} for ${requiredBalance} ESXBot Moedas.`
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
  name: 'buyGift',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buyGift <product> [-a amount]',
  example: [ 'buyGift icecream', 'buyGift chocolate -a 2' ]
};
