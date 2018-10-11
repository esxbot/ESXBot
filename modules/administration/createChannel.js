/**
 * @file createChannel command
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

    let channelType;
    if (!args.text && args.voice) {
      channelType = 'voice';
    }
    else {
      channelType = 'text';
      args.name = args.name.replace(' ', '-');
    }

    let channel = await message.guild.createChannel(args.name, channelType);

    await message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: ESXBot.strings.info(message.guild.language, 'createChannel', message.author.tag, channelType, channel.name),
        footer: {
          text: `ID: ${channel.id}`
        }
      }
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'createc' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', multiple: true, defaultOption: true },
    { name: 'text', type: Boolean, alias: 't' },
    { name: 'voice', type: Boolean, alias: 'v' }
  ]
};

exports.help = {
  name: 'createChannel',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'createChannel [-t | -v] <Channel Name>',
  example: [ 'createChannel -t Text Channel Name', 'createChannel -v Voice Channel Name', 'createChannel Text Channel Name' ]
};
