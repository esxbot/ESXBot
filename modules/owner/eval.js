/**
 * @file eval command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.code) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args.code = args.code.join(' ');

    let evaled;
    if (args.broadcast && ESXBot.shard) {
      evaled = await ESXBot.shard.broadcastEval(args.code);
    }
    else {
      evaled = eval(args.code);
    }

    if (typeof evaled !== 'string') {
      evaled = require('util').inspect(evaled);
    }

    let output = await message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        fields: [
          {
            name: ':inbox_tray:  INPUT',
            value: `\`\`\`js\n${args.code}\n\`\`\``
          },
          {
            name: ':outbox_tray:  OUTPUT',
            value: `\`\`\`js\n${clean(ESXBot, evaled)}\n\`\`\``
          }
        ]
      }
    });

    if (args.delete) {
      output.delete(10000).catch(() => {});
      message.delete(1000).catch(() => {});
    }
  }
  catch(e) {
    let error = await message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        fields: [
          {
            name: ':no_entry:  ERROR',
            value: `\`\`\`js\n${clean(ESXBot, e)}\n\`\`\``
          }
        ]
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });

    if (args.delete) {
      error.delete(10000).catch(() => {});
      message.delete(1000).catch(() => {});
    }
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'code', type: String, multiple: true, defaultOption: true },
    { name: 'broadcast', type: Boolean },
    { name: 'delete', type: Boolean }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'eval',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'eval <JavaScript code> [--delete]',
  example: [ 'eval message.guild.members.size', 'eval ESXBot.users.size --delete' ]
};

/**
 * Cleans the evaled result from tokens, etc.
 * @function clean
 * @param {object} ESXBot The ESXBot object.
 * @param {string} text The evaled result/error before cleaning.
 * @returns {string} The evaled result/error after cleaning.
 */
function clean(ESXBot, text) {
  text = text.toString();
  if (text.includes(ESXBot.token)) {
    text = text.replace(ESXBot.token, 'Not for your evil :eyes:!');
  }
  if (typeof(text) === 'string') {
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}
