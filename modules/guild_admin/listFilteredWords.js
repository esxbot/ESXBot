/**
 * @file listFilteredWords command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT filteredWords FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (!guildSettings || !guildSettings.filteredWords) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notSet', true, 'filtered words'), message.channel);
    }

    let filteredWords = guildSettings.filteredWords.split(' ');

    filteredWords = filteredWords.map((r, i) => `${i + 1}. ${r}`);

    let noOfPages = filteredWords.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Filtered Words',
        description: filteredWords.slice(i * 10, (i * 10) + 10).join('\n'),
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
  aliases: [ 'listfw' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listFilteredWords',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'listFilteredWords [page_no]',
  example: [ 'listFilteredWords', 'listFilteredWords 2' ]
};
