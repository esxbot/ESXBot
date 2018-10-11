/**
 * @file weather command
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

    result = result[0];

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Clima atual',
        fields: [
          {
            name: 'Localização',
            value: result.location.name,
            inline: true
          },
          {
            name: 'Coordenadas',
            value: `${result.location.lat}, ${result.location.long}`,
            inline: true
          },
          {
            name: 'Fuso horário',
            value: `UTC${result.location.timezone >= 0 ? `+${result.location.timezone}` : result.location.timezone}`,
            inline: true
          },
          {
            name: 'Condição',
            value: result.current.skytext,
            inline: true
          },
          {
            name: 'Temperatura',
            value: `${result.current.temperature} \u00B0${result.location.degreetype}`,
            inline: true
          },
          {
            name: 'Feels Like',
            value: `${result.current.feelslike} \u00B0${result.location.degreetype}`,
            inline: true
          },
          {
            name: 'Baixo',
            value: `${result.forecast[1].low} \u00B0${result.location.degreetype}`,
            inline: true
          },
          {
            name: 'Alto',
            value: `${result.forecast[1].high} \u00B0${result.location.degreetype}`,
            inline: true
          },
          {
            name: 'Velocidade do vento',
            value: result.current.winddisplay,
            inline: true
          },
          {
            name: 'Umidade',
            value: `${result.current.humidity}%`,
            inline: true
          },
          {
            name: 'Precipitação',
            value: `${result.forecast[1].precip} cm`,
            inline: true
          },
          {
            name: 'Tempo de observação',
            value: result.current.observationtime,
            inline: true
          }
        ],
        thumbnail: {
          url: `https://resources-esx.github.io/images/weather/${result.current.skycode}.png`
        },
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
  aliases: [ 'we' ],
  enabled: true
};

exports.help = {
  name: 'weather',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'weather <city [, country_code]|zipcode>',
  example: [ 'weather London, UK', 'weather 94109' ]
};
