/**
 * @file messageUser command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.length || !(parseInt(args[0]) < 9223372036854775807)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let user = await ESXBot.fetchUser(args[0]);

    let DMChannel = await user.createDM();
    DMChannel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        description: args.slice(1).join(' ')
      }
    }).catch(e => {
      if (e.code === 50007) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), 'Can\'t send message to this user. They might have disabled their DM or they don\'t share a server with me.', message.channel);
      }
      else {
        ESXBot.log.error(e);
      }
    });
  }
  catch (e) {
    if (e.code === 10013) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'user'), message.channel);
    }
    else {
      ESXBot.log.error(e);
    }
  }
};

exports.config = {
  aliases: [ 'msgu' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'messageUser',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'messageUser <user_id> <message>',
  example: [ 'messageUser USER_ID Hello, how are you?' ]
};
