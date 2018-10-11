/**
 * @file removeSelfAssignableRole command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let index = parseInt(args[0]);
    if (!index || index <= 0) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }
    index -= 1;

    let guildSettings = await ESXBot.db.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (!guildSettings || !guildSettings.selfAssignableRoles) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notSet', true, 'self-assignable roles'), message.channel);
    }
    let roles = guildSettings.selfAssignableRoles.split(' ');

    if (index >= roles.length) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'indexRange', true), message.channel);
    }

    let deletedRoleID = roles[parseInt(args[0]) - 1];
    roles.splice(parseInt(args[0]) - 1, 1);

    await ESXBot.db.run(`UPDATE guildSettings SET selfAssignableRoles='${roles.join(' ')}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.RED,
        description: `I've deleted **${message.guild.roles.get(deletedRoleID).name}** from self assignable roles.`
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
  aliases: [ 'rsar' ],
  enabled: true
};

exports.help = {
  name: 'removeSelfAssignableRole',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'removeSelfAssignableRole <index>',
  example: [ 'removeSelfAssignableRole 3' ]
};
