/**
 * @file suggest command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.description) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let guildSettings = await ESXBot.db.get(`SELECT suggestionChannel FROM guildSettings WHERE guildID=${message.guild.id}`);

    let suggestionChannel;
    if (guildSettings.suggestionChannel) {
      suggestionChannel = message.guild.channels.filter(channel => channel.type === 'text').get(guildSettings.suggestionChannel);
    }

    if (!suggestionChannel) {
      suggestionChannel = message.channel;
    }

    let suggestion = await suggestionChannel.send({
      embed: {
        title: 'Sugestão',
        description: args.description.join(' '),
        image: {
          url: (message.attachments.size && message.attachments.first().height && message.attachments.first().url) || null
        },
        footer: {
          text: `Sugerido por ${message.author.tag}`
        }
      }
    });

    // Delete user's message
    if (message.deletable) {
      message.delete().catch(() => {});
    }

    // Add reactions for voting
    await suggestion.react('👍');
    await suggestion.react('👎');
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'description', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'suggest',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'suggest <SUGGESTION>',
  example: [ 'suggest Adicione uma página de comentários ao site.' ]
};
