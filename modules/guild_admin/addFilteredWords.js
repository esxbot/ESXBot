/**
 * @file addFilteredWords command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let guildSettings = await ESXBot.db.get(`SELECT filteredWords FROM guildSettings WHERE guildID=${message.guild.id}`);

    let filteredWords = [];
    if (guildSettings.filteredWords) {
      filteredWords = guildSettings.filteredWords.split(' ');
    }
    filteredWords = filteredWords.concat(args);
    filteredWords = [ ...new Set(filteredWords) ];

    await ESXBot.db.run(`UPDATE guildSettings SET filteredWords='${filteredWords.join(' ')}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Added Words to Filter List',
        description: args.join(', ')
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
  aliases: [ 'addfw' ],
  enabled: true
};

exports.help = {
  name: 'addFilteredWords',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addFilteredWords word [anotherWord] [someOtherWord]',
  example: [ 'addFilteredWords cast creed race religion' ]
};
