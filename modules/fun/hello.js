/**
 * @file hello command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      description: 'Hi! I\'m **ESXBot**. \u{1F609}\n' +
                   'I\'m a BOT that is going to make your time in this Discord Server amazing!',
      footer: {
        text: `Type ${message.guild.prefix[0]}help to find out more about me.`
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'hi' ],
  enabled: true
};

exports.help = {
  name: 'hello',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'hello',
  example: []
};
