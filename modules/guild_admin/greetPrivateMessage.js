/**
 * @file greetPrivateMessage command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      let guildSettings = await ESXBot.db.get(`SELECT greetPrivateMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

      let greetPrivateMessage = `Não configurado. Definir mensagem privada de saudação usando \`${this.help.name} <Message>\``;
      if (guildSettings.greetPrivateMessage) {
        greetPrivateMessage = await ESXBot.functions.decodeString(guildSettings.greetPrivateMessage);
      }

      message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: 'Saudação Mensagem Privada',
          description: greetPrivateMessage
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      args = args.join(' ');

      let greetPrivateMessage = await ESXBot.functions.encodeString(args);
      await ESXBot.db.run('UPDATE guildSettings SET greetPrivateMessage=(?) WHERE guildID=(?)', [ greetPrivateMessage, message.guild.id ]);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          title: 'Saudação Set Mensagem Privada',
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
  aliases: [ 'greetprvmsg' ],
  enabled: true
};

exports.help = {
  name: 'greetPrivateMessage',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetPrivateMessage [Message]',
  example: [ 'greetPrivateMessage Hello $user! Welcome to $server.' ]
};
