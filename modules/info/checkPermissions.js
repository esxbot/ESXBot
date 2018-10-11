/**
 * @file checkPermissions command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let fields = [];
  let permissions = message.guild.me.permissions.serialize();
  for (let permission in permissions) {
    fields.push({
      name: permission.replace(/_/g, ' ').toTitleCase(),
      value: permissions[permission],
      inline: true
    });
  }
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: `Permissions for ${ESXBot.user.tag}`,
      description: 'Permissions I have in this channel and server.',
      fields: fields
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'checkPerms' ],
  enabled: true
};

exports.help = {
  name: 'checkPermissions',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'checkPermissions',
  example: []
};
