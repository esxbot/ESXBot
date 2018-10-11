/**
 * @Arquivo comando de captura
 * @autor Renildo Marcio (KR Soluções Web)
 * @licença MIT
 */

const capture = require('webshot');

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * O comando foi executado com parâmetros inválidos.
     * @incêndios commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(args[0])) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'invalidInput', true, 'URL'), message.channel);
  }
  let options = {
    windowSize: {
      width: 1366,
      height: 768
    },
    shotSize: {
      width: 'all',
      height: 'all'
    },
    timeout: 15000,
    userAgent: 'Mozilla/5.0 (compatible; U; ABrowse 0.6; Syllable) AppleWebKit/420+ (KHTML, like Gecko)'
  };
  capture(args[0], options, function (err, renderStream) {
    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'connection'), ESXBot.strings.error(message.guild.language, 'serverNotFound', true, args[0]), message.channel);
    }
    let imageBuffers = [];
    renderStream.on('data', function (data) {
      imageBuffers.push(data);
    });
    renderStream.on('end', function () {
      let imageBuffer = Buffer.concat(imageBuffers);
      if (imageBuffer.length > 0) {
        message.channel.send({
          file: {
            attachment: imageBuffer,
            name: 'capture.jpg'
          }
        }).catch(e => {
          ESXBot.log.error(e);
        });
      }
    });
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'capture',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'capture <url>',
  example: [ 'capture esxbot.github.io' ]
};
