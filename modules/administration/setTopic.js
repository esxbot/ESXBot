/**
 * @file setTopic command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let channel = message.mentions.channels.first();
    let topic;
    if (!channel) {
      channel = message.channel;
      topic = args.join(' ');
    }
    else {
      topic = args.slice(1).join(' ').trim();
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

    await channel.setTopic(topic);

    await message.channel.send({
      embed: {
        color: ESXBot.colors.ORANGE,
        description: ESXBot.strings.info(message.guild.language, 'updateChannelTopic', message.author.tag, channel.name, channel.topic)
      }
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'sett' ],
  enabled: true
};

exports.help = {
  name: 'setTopic',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'setTopic [#channel-mention] [Channel Topic]',
  example: [ 'setTopic #channel-name New Topic', 'setTopic New Topic', 'setTopic' ]
};
