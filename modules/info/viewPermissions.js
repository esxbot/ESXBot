/**
 * @file viewPermissions command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let fields = [];
  let permissions = message.member.permissions.serialize();
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
      title: `Permissões para ${message.author.tag}`,
      description: 'Permissões que você tem neste canal e servidor.',
      fields: fields
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'viewPerms' ],
  enabled: true
};

exports.help = {
  name: 'viewPermissions',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'viewPermissions',
  example: []
};
