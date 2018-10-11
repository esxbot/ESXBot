/**
 * @file roleUpdate event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = async (oldRole, newRole) => {
  if (oldRole.name === newRole.name) return;

  try {
    let guildSettings = await newRole.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${newRole.guild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = newRole.guild.channels.get(guildSettings.log);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: newRole.client.colors.ORANGE,
        title: newRole.guild.client.strings.events(newRole.guild.language, 'roleUpdate'),
        fields: [
          {
            name: 'Novo nome de função',
            value: newRole.name || '`Nenhum`',
            inline: true
          },
          {
            name: 'Nome antigo da função',
            value: oldRole.name || '`Nenhum`',
            inline: true
          },
          {
            name: 'ID da função',
            value: newRole.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newRole.client.log.error(e);
    });
  }
  catch (e) {
    newRole.client.log.error(e);
  }
};
