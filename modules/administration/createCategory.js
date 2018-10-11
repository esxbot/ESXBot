/**
 * @file createCategory command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.name) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let minLength = 2, maxLength = 100;
    args.name = args.name.join(' ');
    if (args.name.length < minLength || args.name.length > maxLength) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'channelNameLength', true, minLength, maxLength), message.channel);
    }

    let category = await message.guild.createChannel(args.name, 'category');

    await message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: ESXBot.strings.info(message.guild.language, 'createChannel', message.author.tag, 'category', category.name),
        footer: {
          text: `ID: ${category.id}`
        }
      }
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'createCategory',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'createCategory <Category Name>',
  example: [ 'createCategory News Feed' ]
};
