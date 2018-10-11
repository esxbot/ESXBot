/**
 * @file addAutoAssignableRoles command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    for (let i = 0; i < args.length; i++) {
      if (!(parseInt(args[i]) < 9223372036854775807)) {
        args.splice(args.indexOf(args[i]), 1);
      }
    }
    args = args.filter(r => message.guild.roles.get(r));
    if (args.length < 1) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    let guildSettings =  await ESXBot.db.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`);

    let roles = [];
    if (guildSettings.autoAssignableRoles) {
      roles = guildSettings.autoAssignableRoles.split(' ');
    }
    roles = roles.concat(args);
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = [ ...new Set(roles) ];

    await ESXBot.db.run(`UPDATE guildSettings SET autoAssignableRoles='${roles.join(' ')}' WHERE guildID=${message.guild.id}`);

    let roleNames = [];
    for (let i = 0; i < args.length; i++) {
      roleNames.push(message.guild.roles.get(args[i]).name);
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Added auto assignable roles',
        description: roleNames.join(', ')
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
  aliases: [ 'aaar' ],
  enabled: true
};

exports.help = {
  name: 'addAutoAssignableRoles',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addAutoAssignableRoles <RoleID> [RoleID] [RoleID]',
  example: [ 'addAutoAssignableRoles 443322110055998877 778899550011223344' ]
};
