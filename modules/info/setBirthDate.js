/**
 * @file setBirthDate command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.date) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args.date = Date.parse(args.date.join(' '));

    if (!args.date) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'invalidInput', true, 'date'), message.channel);
    }

    let age = Date.now() - args.date;
    let year = 31556952000;

    if (age > 100 * year) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', '', ESXBot.strings.error(message.guild.language, 'ageAbove100', true), message.channel);
    }
    else if (age < 13 * year) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', '', ESXBot.strings.error(message.guild.language, 'ageBelow13', true), message.channel);
    }

    let user = await ESXBot.db.get(`SELECT birthDate FROM profiles WHERE userID=${message.author.id}`).catch(() => {});

    if (!user) {
      return message.channel.send({
        embed: {
          description: `<@${message.author.id}> você ainda não tinha um perfil. Eu criei agora seu perfil. Agora você pode usar o comando novamente para definir sua data de nascimento.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }

    await ESXBot.db.run('UPDATE profiles SET birthDate=(?) WHERE userID=(?)', [ args.date, message.author.id ]);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Birth Date Set',
        description: `See you on your Birthday, ${message.author.tag}!`
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
  aliases: [ 'setBDate' ],
  enabled: true,
  argsDefinitions: [
    { name: 'date', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'setBirthDate',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setBirthDate <DATE>',
  example: [ 'setBirthDate 2/20/2002' ]
};
