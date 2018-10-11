/**
 * @file musicMasterRole command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!(parseInt(args[0]) < 9223372036854775807)) {
      await ESXBot.db.run(`UPDATE guildSettings SET musicMasterRole=null WHERE guildID=${message.guild.id}`);

      return message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          description: ESXBot.strings.info(message.guild.language, 'removeMusicMasterRole', message.author.tag)
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }

    let role = message.guild.roles.get(args[0]);
    if (!role) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    await ESXBot.db.run(`UPDATE guildSettings SET musicMasterRole=${args[0]} WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: ESXBot.strings.info(message.guild.language, 'addMusicMasterRole', message.author.tag, role.name)
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
  aliases: [ 'musicmaster' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'musicMasterRole',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'musicMasterRole [ROLE_ID]',
  example: [ 'musicMasterRole 319225727067095043', 'musicMasterRole' ]
};
