/**
 * @file channelTopic command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    channel = message.channel;
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Channel Topic',
      description: (channel.topic === null || channel.topic.length < 2) ? 'No channel topic present' : channel.topic
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ct' ],
  enabled: true
};

exports.help = {
  name: 'channelTopic',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'channelTopic [#channel-mention]',
  example: [ 'channelTopic #channel-name', 'channelTopic' ]
};
