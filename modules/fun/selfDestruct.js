/**
 * @file selfDestruct command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.content) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let minTimeout = 5, maxTimeout = 600;
    if (args.timeout < minTimeout || args.timeout > maxTimeout) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'selfDestructTimeout', true, minTimeout, maxTimeout), message.channel);
    }

    if (message.deletable) {
      message.delete().catch(e => {
        ESXBot.log.error(e);
      });
    }

    let secretMessage = await message.channel.send({
      embed: {
        color: ESXBot.colors.DEFAULT,
        description: args.content.join(' '),
        footer: {
          text: `${ESXBot.credentials.ownerId.includes(message.author.id) ? '' : 'This is not an official message from ESXBot or from its creators.'}`
        }
      }
    });
    await secretMessage.delete(args.timeout * 1000);
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'destruct' ],
  enabled: true,
  argsDefinitions: [
    { name: 'content', type: String, alias: 'c', multiple: true, defaultOption: true },
    { name: 'timeout', type: Number, alias: 't', defaultValue: 30 }
  ]
};

exports.help = {
  name: 'selfDestruct',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'selfDestruct <content> [-t <seconds>]',
  example: [ 'selfDestruct This will destruct after 30 seconds', 'selfDestruct This will destruct after 10 seconds -t 10' ]
};
