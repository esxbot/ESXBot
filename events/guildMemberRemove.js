/**
 * @file guildMemberRemove event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = async member => {
  try {
    let guild = await member.client.db.get(`SELECT farewell, farewellMessage, farewellTimeout, log FROM guildSettings WHERE guildID=${member.guild.id}`);
    if (!guild) return;

    if (guild.farewell) {
      let farewellMessage = 'Podemos nos encontrar novamente.';
      if (guild.farewellMessage) {
        farewellMessage = await member.client.functions.decodeString(guild.farewellMessage);
      }
      farewellMessage = farewellMessage.replace(/\$user/ig, `<@${member.id}>`);
      farewellMessage = farewellMessage.replace(/\$server/ig, member.guild.name);
      farewellMessage = farewellMessage.replace(/\$username/ig, member.displayName);
      farewellMessage = farewellMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.config.prefix);

      let farewellChannel = member.guild.channels.get(guild.farewell);
      if (farewellChannel) {
        farewellChannel.send({
          embed: {
            color: member.client.colors.BLUE,
            title: `Adeus ${member.displayName}!`,
            description: farewellMessage
          }
        }).then(m => {
          if (guild.farewellTimeout > 0) {
            m.delete(1000 * parseInt(guild.farewellTimeout)).catch(e => {
              member.client.log.error(e);
            });
          }
        }).catch(e => {
          member.client.log.error(e);
        });
      }
    }

    if (guild.log) {
      if (member.guild.me && member.guild.me.hasPermission('BAN_MEMBERS')) {
        let bannedUsers = await member.guild.fetchBans();
        if (bannedUsers.has(member.id)) return;
      }

      let logChannel = member.guild.channels.get(guild.log);
      if (logChannel) {
        logChannel.send({
          embed: {
            color: member.guild.client.colors.RED,
            title: member.guild.client.strings.events(member.guild.language, 'guildMemberRemove'),
            fields: [
              {
                name: 'Usuário',
                value: member.user.tag,
                inline: true
              },
              {
                name: 'ID do usuário',
                value: member.id,
                inline: true
              }
            ],
            timestamp: new Date()
          }
        }).catch(e => {
          member.guild.client.log.error(e);
        });
      }
    }
  }
  catch (e) {
    member.client.log.error(e);
  }
};
