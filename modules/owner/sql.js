/**
 * @file sql command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.query) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let startTime = new Date();
    let result = await ESXBot.db.run(args.query.join(' '));
    let endTime = new Date();

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: 'SQL query successfully executed.',
        fields: [
          {
            name: 'SQL Query',
            value: `\`\`\`sql\n${result.stmt.sql}\`\`\``
          },
          {
            name: 'Execution Time',
            value: `${endTime - startTime}ms`
          }
        ]
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 'SQLITE_ERROR') {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'sqliteError'), `\`\`\`${e.stack}\`\`\``, message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'query', type: String, multiple: true, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'sql',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sql <SQL Query>',
  example: [ 'sql ' ]
};
