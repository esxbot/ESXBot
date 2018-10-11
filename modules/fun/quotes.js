/**
 * @file quotes command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const quotes = require('../../data/quotes.json');

exports.exec = (ESXBot, message, args) => {
  /*
   * Get a random quote
   */
  let index = ESXBot.functions.getRandomInt(1, Object.keys(quotes).length);

  /**
   * If a quote number is provided, use that number.
   */
  if (!isNaN(args.number)) {
    /**
     * If the quote number exists
     */
    if (args.number >= 1 && args.number <= Object.keys(quotes).length) {
      index = args.number;
    }
  }
  /**
   * If a author is provided, use that author.
   */
  else if (args.author) {
    let authorQuoteIDs = [];
    /**
     * If the quotes list has a quote from the specified author, store it.
     */
    for (let i = 1; i <= Object.keys(quotes).length; i++) {
      if (quotes[i].author.search(new RegExp(args.author.join(' '), 'i')) !== -1) {
        authorQuoteIDs.push(i);
      }
    }
    /**
     * If the author has at least 1 quote, get a random quote number from it.
     */
    if (authorQuoteIDs.length > 0) {
      index = authorQuoteIDs[Math.floor(Math.random() * authorQuoteIDs.length)];
    }
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      description: `*"${quotes[index].quote}"*\n\n**${quotes[index].author}**`,
      footer: {
        text: `Quote Number: ${index}`
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'q' ],
  enabled: true,
  argsDefinitions: [
    { name: 'number', type: Number, alias: 'n' },
    { name: 'author', type: String, alias: 'a', multiple: true }
  ]
};

exports.help = {
  name: 'quotes',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'quotes [ -n | -a Author Name]',
  example: [ 'quotes', 'quotes -n 189', 'quotes -a Albert Einstein' ]
};
