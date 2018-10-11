/**
 * @file resetDatabase command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.profiles) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    await ESXBot.db.run('DELETE FROM profiles');

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: 'ESXBot `profiles` database was successfully reset.'
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
  aliases: [ 'resetdb' ],
  enabled: true,
  argsDefinitions: [
    { name: 'profiles', type: Boolean, alias: 'p' }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'resetDatabase',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'resetDatabase < --profiles >',
  example: [ 'resetDatabase --profiles' ]
};
