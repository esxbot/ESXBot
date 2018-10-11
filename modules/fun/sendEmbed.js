/**
 * @file sendEmbed command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args = JSON.parse(args.join(' '));
    args.footer = {
      text: `${ESXBot.credentials.ownerId.includes(message.author.id) ? '' : 'This is not an official message from ESXBot or from its creators.'}`
    };

    message.channel.send({
      embed: args
    }).then(() => {
      if (message.deletable) {
        message.delete().catch(e => {
          ESXBot.log.error(e);
        });
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), `${ESXBot.strings.error(message.guild.language, 'invalidEmbedObject', true)}\`\`\`${e.toString()}\`\`\``, message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sendEmbed',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'sendEmbed <embedObject>',
  example: [ 'sendEmbed {"title": "Hello", "description": "Isn\'t it cool?"}' ]
};
