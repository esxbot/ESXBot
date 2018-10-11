/**
 * @file messageChannel command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 2 || !(parseInt(args[0]) < 9223372036854775807)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    if (ESXBot.shard) {
      await ESXBot.shard.broadcastEval(`
        let channel = this.channels.get('${args[0]}');
        if (channel) {
          channel.send({
            embed: {
              color: this.colors.BLUE,
              description: '${args.slice(1).join(' ').replace('\'', '\\\'')}'
            }
          }).catch(this.log.error);
        }
      `);
    }
    else {
      let channel = ESXBot.channels.get(args[0]);
      if (channel) {
        channel.send({
          embed: {
            color: ESXBot.colors.BLUE,
            description: args.slice(1).join(' ')
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
        ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'channel'), message.channel);
      }
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'msgc' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'messageChannel',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'messageChannel <channel_id> <message>',
  example: [ 'messageChannel CHANNEL_ID Hello everyone!' ]
};
