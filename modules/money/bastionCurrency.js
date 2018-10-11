/**
 * @file bastionCurrency command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let profile = await ESXBot.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${args.id}`), bastionCurrencies = 0;

    if (profile && profile.bastionCurrencies) {
      bastionCurrencies = profile.bastionCurrencies;
    }

    let description = message.author.id === args.id ? `**${args.tag}** you currently have **${bastionCurrencies}** ESXBot Currencies in your account.` : `**${args.tag}** currently has **${bastionCurrencies}** ESXBot Currencies in their account.`;

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
  name: 'bastionCurrency',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'bastionCurrency [@user-mention]',
  example: [ 'bastionCurrency', 'bastionCurrency @user#0001' ]
};
