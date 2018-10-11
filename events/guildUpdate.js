/**
 * @file guildUpdate event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = async (oldGuild, newGuild) => {
  if (oldGuild.name === newGuild.name) return;

  try {
    let guildSettings = await newGuild.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${newGuild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = newGuild.channels.get(guildSettings.log);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: newGuild.client.colors.ORANGE,
        title: newGuild.client.strings.events(newGuild.language, 'guildUpdate'),
        fields: [
          {
            name: 'Novo nome do servidor',
            value: newGuild.name,
            inline: true
          },
          {
            name: 'Nome do servidor antigo',
            value: oldGuild.name,
            inline: true
          },
          {
            name: 'ID do servidor',
            value: newGuild.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newGuild.client.log.error(e);
    });
  }
  catch (e) {
    newGuild.client.log.error(e);
  }
};
