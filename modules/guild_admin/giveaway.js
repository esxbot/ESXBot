/**
 * @file giveaway command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!('giveaways' in message.guild)) {
      message.guild.giveaways = new Map();
    }

    if (args.item) {
      // Giveaway item name
      args.item = args.item.join(' ');

      // Check if timeout is withing 24 hours
      if (args.timeout < 1 || args.timeout > 24) {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), 'O sorteio só pode durar pelo menos uma hora e no máximo 24 horas.', message.channel);
      }

      // Generate a random reaction for the giveaway message
      let reaction = [ '🎈', '🎊', '🎉', '🎃', '🎁', '🔮', '🎀', '🎐', '🏮' ];
      reaction = reaction[Math.floor(Math.random() * reaction.length)];

      // Send the giveaway message and add the reaction to it
      let giveawayMessage = await message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          author: {
            name: 'Evento de doação!'
          },
          title: args.item,
          description: `React to this message with ${reaction} to participate.`,
          footer: {
            text: `${args.winners} Vencedores • Termina`
          },
          timestamp: new Date(Date.now() + args.timeout * 60 * 60 * 1000)
        }
      });
      await giveawayMessage.react(reaction);

      // Giveaway message details
      let giveawayMessageID = giveawayMessage.id;

      // Start giveaway timeout
      let giveaway = ESXBot.setTimeout(async () => {
        try {
          // Fetch the giveaway message to get new reactions
          giveawayMessage = await message.channel.fetchMessage(giveawayMessageID);

          // Get (only) the users who reacted to the giveaway message
          let participants;
          if (giveawayMessage.reactions.has(reaction)) {
            participants = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => `**${u.tag}** / ${u.id}`);
          }

          // Get random users (winners) from the participants
          let winners;
          if (participants.length) {
            winners = ESXBot.functions.getRandomElements(participants, args.winners, true);
          }

          // If there're winners declare the result
          if (winners) {
            // Declare the result in the channel
            giveawayMessage.edit({
              embed: {
                color: ESXBot.colors.BLUE,
                author: {
                  name: 'Evento de doação Terminou'
                },
                title: args.item,
                description: `Os seguintes usuários ganharam e serão contatados por ${message.author.tag} com sua recompensa.\nAgradeço a todos pela participação. Mais sorte da próxima vez.`,
                fields: [
                  {
                    name: 'Vencedores',
                    value: winners.join('\n')
                  }
                ],
                footer: {
                  text: `Giveaway ID: ${giveawayMessageID}`
                }
              }
            }).catch(e => {
              if (e.code !== 50001) {
                ESXBot.log.error(e);
              }
            });
          }
          // Otherwise state the unfortunate outcome
          else {
            giveawayMessage.edit({
              embed: {
                color: ESXBot.colors.RED,
                title: 'Evento de doação finalizado',
                description: `Infelizmente, ninguém participou e aparentemente não há vencedor para **${args.item}**. 😕`,
                footer: {
                  text: `ID do evento: ${giveawayMessageID}`
                }
              }
            }).catch(e => {
              if (e.code !== 50001) {
                ESXBot.log.error(e);
              }
            });
          }

          // Remove the giveaway details from cache
          message.guild.giveaways.delete(giveawayMessageID);
        }
        catch (e) {
          ESXBot.log.error(e);
        }
      }, args.timeout * 60 * 60 * 1000);

      // Store the giveaway information in cache.
      message.guild.giveaways.set(giveawayMessageID, giveaway);
    }
    else if (args.reroll) {
      if (message.guild.giveaways.has(args.reroll)) {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), 'Essa oferta está sendo executada neste servidor. Você só pode rolar novamente os brindes concluídos ou abruptamente parados.', message.channel);
      }

      // Fetch the giveaway message to get new reactions
      let giveawayMessage = await message.channel.fetchMessage(args.reroll);

      // Check if it's a valid giveaway message
      if (giveawayMessage.author.id !== ESXBot.user.id || giveawayMessage.embeds.length !== 1 || !giveawayMessage.embeds[0].author.name.startsWith('GIVEAWAY')) return;

      let giveawayItem = giveawayMessage.embeds[0].title;
      let reaction = giveawayMessage.reactions.filter(reaction => reaction.me).first();
      if (!reaction) return;
      reaction = reaction.emoji.name;

      // Get (only) the users who reacted to the giveaway message
      let participants;
      if (giveawayMessage.reactions.has(reaction)) {
        participants = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => `**${u.tag}** / ${u.id}`);
      }

      // Get random users (winners) from the participants
      let winners;
      if (participants.length) {
        winners = ESXBot.functions.getRandomElements(participants, args.winners, true);
      }

      // If there're winners declare the result
      if (winners) {
        // Declare the result in the channel
        giveawayMessage.edit({
          embed: {
            color: ESXBot.colors.BLUE,
            author: {
              name: 'Evento de doação revertido!'
            },
            title: giveawayItem,
            description: `Os seguintes usuários ganharam e serão contatados por ${message.author.tag} com sua recompensa.\nAgradeço a todos pela participação. Mais sorte da próxima vez.`,
            fields: [
              {
                name: 'Vencedores',
                value: winners.join('\n')
              }
            ],
            footer: {
              text: `ID do evento: ${giveawayMessage.id}`
            }
          }
        }).catch(e => {
          if (e.code !== 50001) {
            ESXBot.log.error(e);
          }
        });
      }
      // Otherwise state the unfortunate outcome
      else {
        giveawayMessage.edit({
          embed: {
            color: ESXBot.colors.RED,
            title: 'Evento de doação revertido',
            description: `Infelizmente, ninguém participou e aparentemente não há vencedor para **${giveawayItem}**. 😕`,
            footer: {
              text: `ID do evento: ${giveawayMessage.id}`
            }
          }
        }).catch(e => {
          if (e.code !== 50001) {
            ESXBot.log.error(e);
          }
        });
      }
    }
    else if (args.end) {
      if (message.guild.giveaways.has(args.end)) {
        // Clear the giveaway timeout
        ESXBot.clearTimeout(message.guild.giveaways.get(args.end));

        // Remove the giveaway details from cache
        message.guild.giveaways.delete(args.end);

        // Delete the giveaway message
        let giveawayMessage = await message.channel.fetchMessage(args.end);
        giveawayMessage.delete().catch(() => {});

        message.channel.send({
          embed: {
            color: ESXBot.colors.RED,
            title: 'Evento de doação Cancelado',
            description: `O evento de doação com ID **${args.end}** foi cancelado por ${message.author.tag}`
          }
        }).catch(e => {
          ESXBot.log.error(e);
        });
      }
      else {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), 'Não há brindes em execução neste servidor agora.', message.channel);
      }
    }
    else {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return ESXBot.emit('commandUsage', message, this.help);
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
    { name: 'item', type: String, multiple: true, defaultOption: true },
    { name: 'timeout', type: Number, alias: 't', defaultValue: 3 },
    { name: 'winners', type: Number, alias: 'w', defaultValue: 1 },
    { name: 'reroll', type: String, alias: 'r' },
    { name: 'end', type: String, alias: 'e' }
  ],
  ownerOnly: false
};

exports.help = {
  name: 'giveaway',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'giveaway < GIVEAWAY ITEM NAME [-t TIMEOUT_IN_HOURS] [--winners COUNT] | --reroll GIVEAWAY_MESSAGE_ID |--end GIVEAWAY_MESSAGE_ID >',
  example: [ 'giveaway Awesome Goodies! -t 2', 'giveaway ESXBot T-Shirt --winners 5', 'giveaway --reroll 133174241744538617', 'giveaway --end 153174267544338344' ]
};
