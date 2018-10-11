/**
 * @file setBio command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }
    args = args.join(' ');

    let charLimit = 160;
    let bio = await ESXBot.functions.encodeString(args);

    if (bio.length > charLimit) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'bioRange', true, charLimit), message.channel);
    }

    let user = await ESXBot.db.get(`SELECT bio FROM profiles WHERE userID=${message.author.id}`);

    if (!user) {
      return message.channel.send({
        embed: {
          description: `<@${args.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your bio.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }

    await ESXBot.db.run('UPDATE profiles SET bio=(?) WHERE userID=(?)', [ bio, message.author.id ]);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Bio Set',
        description: args,
        footer: {
          text: args.tag
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setBio',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setBio <text>',
  example: [ 'setBio I\'m awesome. :sunglasses:' ]
};
