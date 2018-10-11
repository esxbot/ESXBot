/**
 * @file streamerRole command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let description = `No role in your server has been set as the streamer role. To set a role as the streamer role, run the command \`${this.help.name} [ROLE_ID]\`.`, color = ESXBot.colors.RED;

    if (args.role) {
      if (parseInt(args.message) >= 9223372036854775807) {
        /**
         * The command was ran with invalid parameters.
         * @fires commandUsage
         */
        return ESXBot.emit('commandUsage', message, this.help);
      }

      let role = message.guild.roles.get(args.role);
      if (!role) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
      }

      await ESXBot.db.run(`UPDATE guildSettings SET streamerRole='${role.id}' WHERE guildID=${message.guild.id}`);
      description = ESXBot.strings.info(message.guild.language, 'enableStreamerRole', message.author.tag, role.name);
      color = ESXBot.colors.GREEN;
    }
    else if (args.remove) {
      await ESXBot.db.run(`UPDATE guildSettings SET streamerRole=null WHERE guildID=${message.guild.id}`);
      description = ESXBot.strings.info(message.guild.language, 'disableStreamerRole', message.author.tag);
      color = ESXBot.colors.RED;
    }
    else {
      let guildSettings = await ESXBot.db.get(`SELECT streamerRole FROM guildSettings WHERE guildID=${message.guild.id}`);
      if (guildSettings.streamerRole) {
        let streamerRole = message.guild.roles.get(guildSettings.streamerRole);
        if (streamerRole) {
          description = ESXBot.strings.info(message.guild.language, 'streamerRole', streamerRole.name);
          color = ESXBot.colors.BLUE;
        }
      }
    }

    message.channel.send({
      embed: {
        color: color,
        description: description
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'streamerRole',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'streamerRole [ROLE_ID] [--remove]',
  example: [ 'streamerRole', 'streamerRole 265419266104885248', 'streamerRole --remove' ]
};
