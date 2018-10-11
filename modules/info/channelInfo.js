/**
 * @file channelInfo command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    if (parseInt(args[0]) < 9223372036854775807) {
      channel = message.guild.channels.get(args[0]);
    }
    else channel = message.channel;
  }

  if (channel) {
    let title;
    if (channel.type === 'text') {
      title = 'Text Channel Info';
    }
    else {
      title = 'Voice Channel Info';
    }
    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: title,
        fields: [
          {
            name: 'Name',
            value: channel.name,
            inline: true
          },
          {
            name: 'ID',
            value: channel.id,
            inline: true
          },
          {
            name: 'Topic',
            value: (channel.topic === null || channel.topic.length < 2) ? '-' : channel.topic,
            inline: false
          },
          {
            name: 'Created At',
            value: channel.createdAt.toUTCString(),
            inline: true
          },
          {
            name: 'Users',
            value: channel.members.size,
            inline: true
          }
        ]
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'channelNotFound', true), message.channel);
  }
};

exports.config = {
  aliases: [ 'cinfo' ],
  enabled: true
};

exports.help = {
  name: 'channelInfo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'channelInfo [#channel-mention | CHANNEL_ID]',
  example: [ 'channelInfo #channel-name', 'channelInfo 221133445599667788', 'channelInfo' ]
};
