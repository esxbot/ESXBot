/**
 * @file emojiInfo command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  args = args[0].split(':')[1];
  if (!args) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }
  args = message.guild.emojis.find('name', args);

  if (!args) {
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'emoji'), message.channel);
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Emoji info',
      fields: [
        {
          name: 'Name',
          value: args.name,
          inline: true
        },
        {
          name: 'ID',
          value: args.id,
          inline: true
        },
        {
          name: 'Created At',
          value: args.createdAt.toUTCString(),
          inline: true
        }
      ],
      thumbnail: {
        url: args.url
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'einfo' ],
  enabled: true
};

exports.help = {
  name: 'emojiInfo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'emojiInfo <:emoji:>',
  example: [ 'emojiInfo :esxbot:' ]
};
