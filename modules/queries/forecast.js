/**
 * @file forecast command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const weather = require('weather-js');

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }
  weather.find({ search: args.join(' '), degreeType: 'C' }, function(err, result) {
    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'weatherNotFound', true), message.channel);
    }

    if (!result || result.length < 1) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'connection'), ESXBot.strings.error(message.guild.language, 'connection', true), message.channel);
    }

    let fields = [];
    for (let i = 0; i < result[0].forecast.length; i++) {
      fields.push({
        name: new Date(result[0].forecast[i].date).toDateString(),
        value: `**Condição:** ${result[0].forecast[i].skytextday}\n**Baixo:** ${result[0].forecast[i].low} \u00B0${result[0].location.degreetype}\n**Alto:** ${result[0].forecast[i].high} \u00B0${result[0].location.degreetype}\n**Precipitação:** ${result[0].forecast[i].precip} cm`
      });
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Previsão do tempo',
        description: result[0].location.name,
        fields: fields,
        footer: {
          text: 'Powered by MSN Weather'
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'wefc' ],
  enabled: true
};

exports.help = {
  name: 'forecast',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'forecast < city, country_code | zipcode >',
  example: [ 'forecast London, UK', 'forecast 94109' ]
};
