/**
 * @file currencyGiveaway command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

let giveaway, activeChannel;

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!activeChannel) {
      if (!args.amount || isNaN(args.amount)) {
        /**
        * The command was ran with invalid parameters.
        * @fires commandUsage
        */
        return ESXBot.emit('commandUsage', message, this.help);
      }

      /**
      * Time in hour(s) the giveaway event should go on.
      * @constant
      * @type {number}
      * @default
      */
      const TIMEOUT = 3;
      let reaction = [ '🎈', '🎊', '🎉', '🎃', '🎁' ];

      reaction = reaction[Math.floor(Math.random() * reaction.length)];

      let giveawayMessage = await message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: 'GIVEAWAY! 🎉',
          description: `Giveaway event started. React to this message with ${reaction} to get a chance to win **${args.amount}** ESXBot Moedas.`,
          footer: {
            text: `Event stops in ${TIMEOUT} hours. You will get your reward after the event has concluded.`
          }
        }
      });
      await giveawayMessage.react(reaction);

      let giveawayMessageID = giveawayMessage.id;
      activeChannel = message.channel.id;

      giveaway = ESXBot.setTimeout(async () => {
        try {
          let giveawayMessage = await message.channel.fetchMessage(giveawayMessageID);

          // reaction = encodeURIComponent(reaction);

          let winners = [];
          if (giveawayMessage.reactions.get(reaction)) {
            winners = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => u.id);
          }

          let winner;
          while (!winner && winners.length) {
            winner = winners[Math.floor(Math.random() * winners.length)];
            winners.splice(winners.indexOf(winner), 1);
            winner = await ESXBot.fetchUser(winner).catch(() => {});
          }

          if (winner) {
            /**
            * User's account is debited with `args.amount` ESXBot Moedas
            * @fires userDebit
            */
            ESXBot.emit('userDebit', winner, args.amount);

            giveawayMessage.edit('', {
              embed: {
                color: ESXBot.colors.BLUE,
                title: 'Giveaway Event Ended',
                description: `${winner} won the giveaway! And has been awarded with **${args.amount}** ESXBot Moedas.\nThank you everyone for participating. Better luck next time.`
              }
            }).catch(e => {
              ESXBot.log.error(e);
            });

            winner.send({
              embed: {
                color: ESXBot.colors.BLUE,
                title: 'Congratulations',
                description: `You won the giveaway in **${message.guild.name}** Server! And you've been awarded with **${args.amount}** ESXBot Moedas.`
              }
            }).catch(() => {});
          }
          else {
            giveawayMessage.edit('', {
              embed: {
                color: ESXBot.colors.RED,
                title: 'Giveaway Event Ended',
                description: 'Unfortunately, no one participated and apparently there\'s no winner. 😕'
              }
            }).catch(e => {
              ESXBot.log.error(e);
            });
          }

          activeChannel = null;
        }
        catch (e) {
          ESXBot.log.error(e);
        }
      }, TIMEOUT * 60 * 60 * 1000);
    }
    else {
      if (args.end) {
        ESXBot.clearTimeout(giveaway);
        activeChannel = null;

        message.channel.send({
          embed: {
            color: ESXBot.colors.RED,
            title: 'Giveaway Event Ended',
            description: `The giveaway event was abruptly ended by ${message.author.tag}. Sorry, no giveaways this time!`
          }
        }).catch(e => {
          ESXBot.log.error(e);
        });
      }
      else {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'busy'), ESXBot.strings.error(message.guild.language, 'isEventInUse', true, 'giveaway'), message.channel);
      }
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
    { name: 'amount', type: Number, multiple: true, defaultOption: true },
    { name: 'end', type: Boolean, alias: 'e' }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'currencyGiveaway',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'currencyGiveaway <amount | --end>',
  example: [ 'currencyGiveaway 10', 'currencyGiveaway --end' ]
};
