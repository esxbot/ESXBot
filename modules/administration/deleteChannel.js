/**
 * @file deleteChannel command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let channel = message.mentions.channels.first();
    if (!channel) {
      channel = message.channel;
      if (args.id) {
        channel = message.guild.channels.get(args.id);
      }
      else if (args.name) {
        channel = message.guild.channels.find('name', args.name.join(' '));
      }
      if (!channel) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'channelNotFound', true), message.channel);
      }
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

    await channel.delete();

    if (channel.id === message.channel.id) return;

    await message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        description: ESXBot.strings.info(message.guild.language, 'deleteChannel', message.author.tag, channel.type, channel.name)
      }
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'deletec' ],
  enabled: true,
  argsDefinitions: [
    { name: 'mention', type: String, alias: 'm', defaultOption: true },
    { name: 'id', type: String, alias: 'i' },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'deleteChannel',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'deleteChannel [ [-m] #channel-mention | -i CHANNEL_ID | -n Channel Name ]',
  example: [ 'deleteChannel -m #channel-name', 'deleteChannel -i 298889698368028672', 'deleteChannel -n Control Room' ]
};
