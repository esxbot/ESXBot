/**
 * @file renameChannel command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.old || !args.new) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let minLength = 2, maxLength = 100;
    args.old = args.old.join(' ');
    args.new = args.new.join(' ');

    if (args.new.length < minLength || args.new.length > maxLength) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'channelNameLength', true, minLength, maxLength), message.channel);
    }

    let channel = message.channel;
    if (args.voice) {
      channel = message.guild.channels.filter(c => c.type === 'voice').find('name', args.old);
    }
    else {
      args.old = args.old.replace(' ', '-');
      args.new = args.new.replace(' ', '-');
      channel = message.guild.channels.filter(c => c.type === 'text').find('name', args.old);
    }

    if (!channel) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'channelNotFound', true), message.channel);
    }

    if (!channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
      /**
      * User has missing permissions.
      * @fires userMissingPermissions
      */
      return ESXBot.emit('userMissingPermissions', this.help.userTextPermission);
    }
    if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
      /**
      * ESXBot has missing permissions.
      * @fires esxbotMissingPermissions
      */
      return ESXBot.emit('esxbotMissingPermissions', this.help.botPermission, message);
    }

    await channel.setName(args.new);
    await message.channel.send({
      embed: {
        color: ESXBot.colors.ORANGE,
        description: ESXBot.strings.info(message.guild.language, 'renameChannel', message.author.tag, channel.type, args.old, args.new),
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
  aliases: [ 'renamec' ],
  enabled: true,
  argsDefinitions: [
    { name: 'text', type: Boolean, alias: 't' },
    { name: 'voice', type: Boolean, alias: 'v' },
    { name: 'old', type: String, alias: 'o', multiple: true },
    { name: 'new', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'renameChannel',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'renameChannel [ -t | -v ] < -o Old Channel Name -n New Channel Name>',
  example: [ 'renameChannel -t -o bot-commands -n Songs Deck', 'renameChannel -v -o Music Zone -n Songs Deck' ]
};
