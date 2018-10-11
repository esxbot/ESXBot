/**
 * @file todo command
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

    let todo = await ESXBot.db.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`);

    if (!todo) {
      await ESXBot.db.run('INSERT OR IGNORE INTO todo (ownerID, list) VALUES (?, ?)', [ message.author.id, `["${args.join(' ')}"]` ]);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          title: 'Todo list created',
          description: `${message.author.username}, I've created your todo list and added **${args.join(' ')}** to it.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      let list = JSON.parse(todo.list);
      list.push(args.join(' '));

      await ESXBot.db.run(`UPDATE todo SET list='${JSON.stringify(list)}' WHERE ownerID=${message.author.id}`);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          title: 'Todo list updated',
          description: `${message.author.username}, I've added **${args.join(' ')}** to your todo list.`
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
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'todo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'todo <text>',
  example: [ 'todo Reconfigure my firewall' ]
};
