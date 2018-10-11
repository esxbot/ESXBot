/**
 * @file userLookup command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.id) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let user = await ESXBot.fetchUser(args.id);

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: `${user.bot ? 'Bot' : 'User'} Lookup`,
        fields: [
          {
            name: 'Nome de usuário',
            value: user.username,
            inline: true
          },
          {
            name: 'Discriminador',
            value: user.discriminator,
            inline: true
          },
          {
            name: 'ID',
            value: user.id,
            inline: true
          }
        ],
        thumbnail: {
          url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}`
        }
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
  aliases: [ 'uLookup' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'userLookup',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'userLookup <USER_ID>',
  example: [ 'userLookup 167122669385743141' ]
};
