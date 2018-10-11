/**
 * @file animoji command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  let emoji = message.guild.emojis.find('name', args.name);

  if (emoji) {
    message.channel.send({
      files: [ emoji.url ]
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'animote' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'animoji',
  botPermission: '',
  userTextPermission: 'ADD_REACTIONS',
  userVoicePermission: '',
  usage: 'animoji <ANIMATED_EMOJI_NAME>',
  example: [ 'animoji PartyWumpus' ]
};
