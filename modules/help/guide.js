/**
 * @file guide command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.GOLD,
      title: 'ESXBot Bot',
      url: 'https://esxbot.github.io/',
      description: 'Need help installing and setting up Private ESXBot Bot? No worries, we have made an amazing guide to help you out on that. And if you don\'t understand that or you need any more help or maybe if you just have a simple question, just join the ESXBot HQ on Discord.',
      fields: [
        {
          name: 'ESXBot Bot - Documentation',
          value: 'https://docs-esx.github.io/'
        },
        {
          name: 'ESXBot HQ Invite Link',
          value: 'https://discord.gg/8zGbh3T'
        }
      ]
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'guide',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'guide',
  example: []
};
