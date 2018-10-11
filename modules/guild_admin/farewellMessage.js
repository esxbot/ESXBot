/**
 * @file farewellMessage command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      let guildSettings = await ESXBot.db.get(`SELECT farewellMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

      let farewellMessage = `Not set. Set farewell message using \`${this.help.name} <Message>\``;
      if (guildSettings.farewellMessage) {
        farewellMessage = await ESXBot.functions.decodeString(guildSettings.farewellMessage);
      }

      message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: 'Farewell Message',
          description: farewellMessage
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      args = args.join(' ');

      let farewellMessage = await ESXBot.functions.encodeString(args);
      await ESXBot.db.run('UPDATE guildSettings SET farewellMessage=(?) WHERE guildID=(?)', [ farewellMessage, message.guild.id ]);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          title: 'Farewell Message Set',
          description: args
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'fmsg' ],
  enabled: true
};

exports.help = {
  name: 'farewellMessage',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewellMessage [Message]',
  example: [ 'farewellMessage Goodbye $username. Hope to see you soon!' ]
};
