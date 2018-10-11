/**
 * @file deleteTodo command
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

    let todo = await ESXBot.db.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`);

    if (!todo) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'todoNotFound', true, message.author.username), message.channel);
    }
    else {
      let list = JSON.parse(todo.list);

      if (index >= list.length) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'indexRange', true), message.channel);
      }

      let deletedItem = list[parseInt(args[0]) - 1];
      list.splice(parseInt(args[0]) - 1, 1);

      await ESXBot.db.run(`UPDATE todo SET list='${JSON.stringify(list)}' WHERE ownerID=${message.author.id}`);

      message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          description: `${message.author.username}, I've deleted **${deletedItem}** from your todo list.`
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
  aliases: [ 'deltodo' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'deleteTodo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'deleteTodo <index>',
  example: [ 'deleteTodo 3' ]
};
