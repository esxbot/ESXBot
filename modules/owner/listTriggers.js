/**
 * @file listTriggers command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let triggers = await ESXBot.db.all('SELECT trigger FROM triggers');

    if (triggers.length === 0) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'triggerNotFound', true), message.channel);
    }

    triggers = triggers.map((t, i) => `${i + 1}. ${t.trigger}`);

    let noOfPages = triggers.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'List of triggers',
        description: triggers.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
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
  aliases: [ 'listtrips' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'listTriggers',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'listTriggers [page_no]',
  example: [ 'listTriggers', 'listTriggers 2' ]
};
