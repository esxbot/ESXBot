/**
 * @file channelUpdate event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = async (oldChannel, newChannel) => {
  if (!oldChannel.guild) return;
  if (oldChannel.name === newChannel.name) return;

  try {
    let guildSettings = await newChannel.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${newChannel.guild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = newChannel.guild.channels.get(guildSettings.log);
    if (!logChannel) return;

    let title = newChannel.client.strings.events(newChannel.guild.language, 'channelUpdate');
    if (newChannel.type === 'text') {
      title = newChannel.client.strings.events(newChannel.guild.language, 'textChannelUpdate');
    }
    else if (newChannel.type === 'voice') {
      title = newChannel.client.strings.events(newChannel.guild.language, 'voiceChannelUpdate');
    }
    else if (newChannel.type === 'category') {
      title = newChannel.client.strings.events(newChannel.guild.language, 'categoryChannelUpdate');
    }

    logChannel.send({
      embed: {
        color: newChannel.client.colors.ORANGE,
        title: title,
        fields: [
          {
            name: 'Novo nome do canal',
            value: newChannel.name,
            inline: true
          },
          {
            name: 'Nome antigo do canal',
            value: oldChannel.name,
            inline: true
          },
          {
            name: 'ID do canal',
            value: newChannel.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newChannel.client.log.error(e);
    });
  }
  catch (e) {
    newChannel.client.log.error(e);
  }
};
