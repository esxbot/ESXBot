/**
 * @file buy command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.index) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let guildShop = await message.client.db.get(`SELECT custom FROM guildShop WHERE guildID=${message.guild.id}`);

    let itemsInShop;
    if (guildShop && guildShop.custom) {
      itemsInShop = await ESXBot.functions.decodeString(guildShop.custom);
      itemsInShop = JSON.parse(itemsInShop);
    }
    else {
      itemsInShop = [];
    }

    args.index = Math.abs(args.index);
    args.index = args.index - 1;

    if (args.index > itemsInShop.length) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'indexRange', true), message.channel);
    }

    // Check if user has sufficient balance
    let userProfile = await ESXBot.db.get(`SELECT esxbotCurrencies FROM profiles WHERE userID='${message.author.id}'`);
    let userBalance = parseInt(userProfile.esxbotCurrencies);

    if (userBalance < parseInt(itemsInShop[args.index].value)) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'insufficientBalance'), ESXBot.strings.error(message.guild.language, 'insufficientBalance', true, userBalance), message.channel);
    }

    // Add item to user's item list
    let userItems = await ESXBot.db.get(`SELECT custom_items FROM shop_items WHERE userID='${message.author.id}' AND guildID='${message.guild.id}'`);
    if (userItems && userItems.custom_items) {
      userItems = await ESXBot.functions.decodeString(userItems.custom_items);
      userItems = JSON.parse(userItems);
    }
    else {
      userItems = [];
    }

    userItems.push(itemsInShop[args.index].name);
    userItems = JSON.stringify(userItems);
    userItems = await ESXBot.functions.encodeString(userItems);

    await ESXBot.db.run('INSERT OR REPLACE INTO shop_items (userID, guildID, custom_items) VALUES(?, ?, ?)', [ message.author.id, message.guild.id, userItems ]);

    // Transaction
    ESXBot.emit('userCredit', message.author, itemsInShop[args.index].value);

    if (message.author.id !== message.guild.owner.id) {
      ESXBot.emit('userDebit', message.guild.owner, (0.9) * itemsInShop[args.index].value);
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: `${message.author.tag} comprou **${itemsInShop[args.index].name}** por **${itemsInShop[args.index].value}** ESXBot Moedas.`
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
    { name: 'index', type: Number, defaultOption: true }
  ]
};

exports.help = {
  name: 'buy',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buy <ITEM_INDEX>',
  example: [ 'buy 3' ]
};
