/**
 * @file date command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const location = require('weather-js');

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  location.find({ search: args.join(' ') }, function(err, result) {
    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'location'), message.channel);
    }

    if (!result || result.length < 1) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'connection'), ESXBot.strings.error(message.guild.language, 'connection', true), message.channel);
    }

    let date = ESXBot.functions.timezoneOffsetToDate(parseFloat(result[0].location.timezone)).toUTCString();
    date = date.substring(0, date.length - 4);

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        fields: [
          {
            name: 'Localização',
            value: result[0].location.name
          },
          {
            name: 'Data e hora',
            value: date
          }
        ]
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'time' ],
  enabled: true
};

exports.help = {
  name: 'date',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'date < location name[, country code] | zip code >',
  example: [ 'date New York, US', 'date 94109' ]
};
