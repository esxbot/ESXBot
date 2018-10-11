/**
 * @file setLocation command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.location) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args.location = args.location.join(' ');

    let charLimit = 20;
    if (args.location.length > charLimit) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'locationRange', true, charLimit), message.channel);
    }

    let user = await ESXBot.db.get(`SELECT location FROM profiles WHERE userID=${message.author.id}`).catch(() => {});

    if (!user) {
      return message.channel.send({
        embed: {
          description: `<@${message.author.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your location.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }

    await ESXBot.db.run('UPDATE profiles SET location=(?) WHERE userID=(?)', [ args.location, message.author.id ]);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Location Set',
        description: `${message.author.tag}, your location has been set to ${args.location}.`
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
  enabled: true,
  argsDefinitions: [
    { name: 'location', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'setLocation',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setLocation <CITY>',
  example: [ 'setLocation New York' ]
};
