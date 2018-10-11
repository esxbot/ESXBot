/**
 * @file give command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.amount) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await message.guild.fetchMember(args.id);
      if (user) {
        user = user.user;
      }
    }
    if (!user) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'giveNoUser', true), message.channel);
    }

    args.amount = Math.abs(args.amount);
    if (ESXBot.credentials.ownerId.includes(message.author.id)) {
      ESXBot.emit('userDebit', user, args.amount);

      /**
        * Send a message in the channel to let the Bot Owner know that the operation was successful.
        */
      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `Você ganhou **${args.amount}** ESXBot Moedas de <@${user.id}>.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });

      /**
        * Let the user know by DM that their account has been debited.
        */
      user.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `Sua conta foi debitada com **${args.amount}** ESXBot Moedas.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      if (message.author.id === user.id) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), ESXBot.strings.error(message.guild.language, 'giveYourself', true), message.channel);
      }

      let sender = await ESXBot.db.get(`SELECT esxbotCurrencies FROM profiles WHERE userID=${message.author.id}`);
      sender.esxbotCurrencies = parseInt(sender.esxbotCurrencies);

      if (sender.esxbotCurrencies < args.amount) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'insufficientBalance'), ESXBot.strings.error(message.guild.language, 'insufficientBalance', true, sender.esxbotCurrencies), message.channel);
      }

      let giveLimit = 0.5;
      if (args.amount >= giveLimit * sender.esxbotCurrencies) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'giveLimit', true, giveLimit * 100), message.channel);
      }

      ESXBot.emit('userDebit', user, args.amount);
      ESXBot.emit('userCredit', message.author, args.amount);

      /**
       * Send a message in the channel to let the user know that the operation was successful.
       */
      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `Você deu **${args.amount}** ESXBot Moedas para <@${user.id}>.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });

      /**
       * Let the user receiving ESXBot Moedas know by DM that their account has been debited.
       */
      user.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `Sua conta foi debitada com **${args.amount}** ESXBot Moedas.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });

      /**
       * Let the user sending ESXBot Moedas know by DM that their account has been credited.
       */
      message.author.send({
        embed: {
          color: ESXBot.colors.RED,
          description: `Sua conta foi creditada com **${args.amount}** ESXBot Moedas.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'amount', type: Number, alias: 'n' }
  ]
};

exports.help = {
  name: 'give',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'give < @USER_MENTION | USER_ID > <-n AMOUNT>',
  example: [ 'give @user#0001 -n 50', 'give 114312165731193137 -n 50' ]
};
