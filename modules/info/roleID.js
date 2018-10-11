/**
 * @file roleID command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  let role = message.mentions.roles.first();
  if (!role) {
    role = message.guild.roles.find('name', args.join(' '));
  }

  if (role) {
    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        fields: [
          {
            name: 'Role Name',
            value: role.name,
            inline: true
          },
          {
            name: 'ID',
            value: role.id,
            inline: true
          }
        ]
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
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
  }
};

exports.config = {
  aliases: [ 'rid' ],
  enabled: true
};

exports.help = {
  name: 'roleID',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roleInfo <@role-mention|role_name>',
  example: [ 'roleInfo @Dark Knigths', 'roleInfo The Legends' ]
};
