/**
 * @file esxbotCurrency command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let profile = await ESXBot.db.get(`SELECT esxbotCurrencies FROM profiles WHERE userID=${args.id}`), esxbotCurrencies = 0;

    if (profile && profile.esxbotCurrencies) {
      esxbotCurrencies = profile.esxbotCurrencies;
    }

    let description = message.author.id === args.id ? `**${args.tag}** você tem atualmente **${esxbotCurrencies}** ESXBot Moedas Na sua conta.` : `**${args.tag}** tem atualmente **${esxbotCurrencies}** ESXBot Moedas em sua conta.`;

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        description: description
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'currency', 'money' ],
  enabled: true
};

exports.help = {
  name: 'esxbotCurrency',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'esxbotCurrency [@user-mention]',
  example: [ 'esxbotCurrency', 'esxbotCurrency @user#0001' ]
};
