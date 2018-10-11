/**
 * @file channelID command
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
      fields: [
        {
          name: 'Channel',
          value: `#${channel.name}`,
          inline: true
        },
        {
          name: 'ID',
          value: channel.id,
          inline: true
        }
      ]
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'cid' ],
  enabled: true
};

exports.help = {
  name: 'channelID',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'channelID [#channel-mention]',
  example: [ 'channelID #channel-name', 'channelID' ]
};
