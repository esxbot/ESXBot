/**
 * @file cite command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.message || !(parseInt(args.message) < 9223372036854775807)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let channel = message.mentions.channels.first();
    if (!channel) {
      channel = message.channel;
    }

    let citedMessage = await channel.fetchMessage(args.message);

    let image;
    if (citedMessage.attachments.size) {
      if (citedMessage.attachments.first().height) {
        image = citedMessage.attachments.first().url;
      }
    }

    if (!image && !citedMessage.content) {
      return message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          author: {
            name: `${citedMessage.author.tag} ${message.channel.id === citedMessage.channel.id ? '' : `em #${citedMessage.channel.name}`}`,
            icon_url: citedMessage.author.displayAvatarURL
          },
          description: '*A mensagem não tem nenhum conteúdo que possa ser citado.*',
          fields: [
            {
              name: 'Link para a mensagem',
              value: `https://discordapp.com/channels/${citedMessage.guild.id}/${citedMessage.channel.id}/${citedMessage.id}`
            }
          ],
          timestamp: citedMessage.createdAt
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        author: {
          name: `${citedMessage.author.tag} ${message.channel.id === citedMessage.channel.id ? '' : `in #${citedMessage.channel.name}`}`,
          icon_url: citedMessage.author.displayAvatarURL
        },
        description: citedMessage.content,
        fields: [
          {
            name: 'Link para a mensagem',
            value: `https://discordapp.com/channels/${citedMessage.guild.id}/${citedMessage.channel.id}/${citedMessage.id}`
          }
        ],
        image: {
          url: image
        },
        timestamp: citedMessage.createdAt
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.toString().includes('Unknown Message')) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'messageNotFound', true), message.channel);
    }
    else {
      ESXBot.log.error(e);
    }
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'message', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'cite',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'cite <MESSAGE_ID>',
  example: [ 'cite 221133446677558899' ]
};
