/**
 * @file coinMarketCap command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.name || !args.name.length) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let options = {
      headers: {
        'User-Agent': `ESXBot: Discord Bot (https://esxbot.github.io, ${ESXBot.package.version})`
      },
      url: `https://api.coinmarketcap.com/v1/ticker/${encodeURIComponent(args.name.join('-').toLowerCase())}`,
      json: true
    };
    let response = await request(options);

    response = response[0];

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: response.name,
        fields: [
          {
            name: 'Símbolo',
            value: response.symbol,
            inline: true
          },
          {
            name: 'Rank',
            value: response.rank,
            inline: true
          },
          {
            name: 'Preço',
            value: `$${response.price_usd} USD\n${response.price_btc} BTC`,
            inline: true
          },
          {
            name: 'Valor de mercado',
            value: `$${response.market_cap_usd} USD`,
            inline: true
          },
          {
            name: 'Fornecimento Circulante',
            value: `${response.available_supply} ${response.symbol}`,
            inline: true
          },
          {
            name: 'Suprimento máximo',
            value: response.max_supply ? `${response.max_supply} ${response.symbol}` : '-',
            inline: true
          },
          {
            name: 'Volume (24h)',
            value: `$${response['24h_volume_usd']} USD`,
            inline: true
          },
          {
            name: 'Mudança',
            value: `${response.percent_change_1h}% na última hora\n${response.percent_change_24h}% no dia passado\n${response.percent_change_7d}% na semana passada`,
            inline: true
          }
        ],
        thumbnail: {
          url: `https://files.coinmarketcap.com/static/img/coins/128x128/${response.id}.png`
        },
        footer: {
          text: 'Powered by CoinMarketCap'
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      return ESXBot.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'coinMarketCap',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'coinMarketCap <CRYPTOCURRENCY_NAME>',
  example: [ 'coinMarketCap bitcoin' ]
};
