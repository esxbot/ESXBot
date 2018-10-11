/**
 * @file poll command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.pollMessage || !/^(.+( ?; ?.+[^;])+)$/i.test(args.pollMessage.join(' '))) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    if (!message.channel.hasOwnProperty('poll')) {
      message.channel.poll = {};
      message.channel.poll.usersVoted = [];

      // let pollMessage = args.pollMessage.join(' ').split(';');
      message.channel.poll.message = args.pollMessage.join(' ').split(';');
      args.time = Math.abs(args.time);
      args.time = args.time && args.time < 1440 ? args.time : 60;

      let answers = [];
      for (let i = 1; i < message.channel.poll.message.length; i++) {
        answers.push({
          name: `${i}.`,
          value: `${message.channel.poll.message[i]}`,
          inline: true
        });
      }

      let pollStatus = await message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: 'Votação começou',
          description: `Uma votação foi iniciada por ${message.author}.\n\n**${message.channel.poll.message[0]}**`,
          fields: answers,
          footer: {
            text: `Vote enviando o número correspondente da opção. • Enquete termina em ${args.time} minutos.`
          }
        }
      });

      message.channel.poll.collector = message.channel.createMessageCollector(
        m => (!m.author.bot && parseInt(m.content) > 0 && parseInt(m.content) < message.channel.poll.message.length && !message.channel.poll.usersVoted.includes(m.author.id)),
        { time: args.time * 60 * 1000 }
      );

      message.channel.poll.collector.on('collect', (msg, votes) => {
        if (msg.deletable) {
          msg.delete().catch(e => {
            ESXBot.log.error(e);
          });
        }
        msg.channel.send({
          embed: {
            description: `Obrigado, ${msg.author}, prlo seu voto.`,
            footer: {
              text: `${votes.collected.size} votos no total.`
            }
          }
        }).then(m => {
          message.channel.poll.usersVoted.push(msg.author.id);
          m.delete(5000).catch(e => {
            ESXBot.log.error(e);
          });
        });
      });

      message.channel.poll.collector.on('end', (pollRes) => {
        pollRes = pollRes.map(r => r.content);
        pollRes = pollRes.filter(res => parseInt(res) && parseInt(res) > 0 && parseInt(res) < message.channel.poll.message.length);
        if (pollRes.length === 0) {
          return message.channel.send({
            embed: {
              color: ESXBot.colors.RED,
              title: 'Enquete terminada',
              description: 'Infelizmente, nenhum voto foi dado.'
            }
          }).then(() => {
            pollStatus.delete().catch(e => {
              ESXBot.log.error(e);
            });
            delete message.channel.poll;
          }).catch(e => {
            ESXBot.log.error(e);
          });
        }

        for (let i = message.channel.poll.message.length - 1; i > 0; i--) {
          pollRes.unshift(i);
        }
        let count = {};
        for (let i = 0; i < pollRes.length; i++) {
          count[pollRes[i]] = count[pollRes[i]] ? count[pollRes[i]] + 1 : 1;
        }
        let result = [];
        let totalVotes = (pollRes.length - (message.channel.poll.message.length - 1));
        for (let i = 1; i < message.channel.poll.message.length; i++) {
          let numOfVotes = count[Object.keys(count)[i - 1]] - 1;
          result.push({
            name: message.channel.poll.message[i],
            value: `${(numOfVotes / totalVotes) * 100}% (${numOfVotes} de ${totalVotes})`,
            inline: true
          });
        }

        message.channel.send({
          embed: {
            color: ESXBot.colors.BLUE,
            title: 'Enquete terminada',
            description: `Resultados da enquete para **${message.channel.poll.message[0]}**`,
            fields: result
          }
        }).then(() => {
          pollStatus.delete().catch(e => {
            ESXBot.log.error(e);
          });
          delete message.channel.poll;
        }).catch(e => {
          ESXBot.log.error(e);
        });
      });
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'busy'), ESXBot.strings.error(message.guild.language, 'isEventInUse', true, 'poll'), message.channel);
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
    { name: 'pollMessage', type: String, multiple: true, defaultOption: true },
    { name: 'time', type: Number, alias: 't', defaultValue: 60 }
  ]
};

exports.help = {
  name: 'poll',
  botPermission: '',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'poll <question>;<option1>[;<option2>[...]] [-t TIME_IN_MINUTES]',
  example: [ 'poll Which is the game of the week?;Call of Duty©: Infinity Warfare;Tom Clancy\'s Ghost Recon© Wildlands' ]
};
