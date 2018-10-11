/**
 * @file greetMessage command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      let guildSettings = await ESXBot.db.get(`SELECT greetMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

      let greetMessage = `Não configurado. Definir mensagem de saudação usando \`${this.help.name} <Message>\``;
      if (guildSettings.greetMessage) {
        greetMessage = await ESXBot.functions.decodeString(guildSettings.greetMessage);
      }

      message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: 'Mensagem de saudação',
          description: greetMessage
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      args = args.join(' ');

      let greetMessage = await ESXBot.functions.encodeString(args);
      await ESXBot.db.run('UPDATE guildSettings SET greetMessage=(?) WHERE guildID=(?)', [ greetMessage, message.guild.id ]);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          title: 'Conjunto de mensagens de saudação',
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
  aliases: [ 'gmsg' ],
  enabled: true
};

exports.help = {
  name: 'greetMessage',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetMessage [Message]',
  example: [ 'greetMessage Hello $user! Welcome to $server.' ]
};
