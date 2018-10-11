/**
 * @file removeFilteredWord command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let index = parseInt(args[0]);
    if (!index || index <= 0) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }
    index -= 1;

    let guildSettings = await ESXBot.db.get(`SELECT filteredWords FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (!guildSettings || !guildSettings.filteredWords) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notSet', true, 'filtered words'), message.channel);
    }
    else {
      let filteredWords = guildSettings.filteredWords.split(' ');

      if (index >= filteredWords.length) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'indexRange', true), message.channel);
      }

      let removedFilteredWord = filteredWords[parseInt(args[0]) - 1];
      filteredWords.splice(parseInt(args[0]) - 1, 1);

      await ESXBot.db.run(`UPDATE guildSettings SET filteredWords='${filteredWords.join(' ')}' WHERE guildID=${message.guild.id}`);

      message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          description: `I've deleted **${removedFilteredWord}** from filtered words.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'removefw' ],
  enabled: true
};

exports.help = {
  name: 'removeFilteredWord',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'removeFilteredWord <index>',
  example: [ 'removeFilteredWord 3' ]
};
