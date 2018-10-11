/**
 * @file setLanguage command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.name && !args.list) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    if (args.list) {
      return message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          title: 'Available Languages',
          description: `ESXBot's translations are a community effort. If you want to see ESXBot translated into another language we'd love your help. Visit our [translation site](https://i18n-esx.github.io) for more info.\n\nCurrenty it's available in the following languages:\n${ESXBot.strings.availableLanguages.join(', ').toUpperCase()}`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }

    args.name = args.name.toLowerCase();
    if (args.name) {
      if (!ESXBot.strings.availableLanguages.includes(args.name)) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'Language Code'), message.channel);
      }

      await ESXBot.db.run(`UPDATE guildSettings SET language='${args.name}' WHERE guildID=${message.guild.id}`);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `O idioma desse servidor agora está definido como: \`${args.name.toUpperCase()}\` \n\nA tradução do ESXBot é um esforço da comunidade. Assim, algumas traduções podem não ser precisas ou completas, mas você pode melhorá-las se quiser [translation site](https://i18n-esx.github.io).\nSe você ajudar a traduzir ESXBot, você recebe um especial **Tradutores** função e acesso a um canal secreto para tradutores no servidor Discord oficial da ESXBot: https://discord.gg/8zGbh3T`
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'list', type: Boolean, alias: 'l' }
  ]
};

exports.help = {
  name: 'setLanguage',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'setLanguage < Language Code | --list>',
  example: [ 'setLanguage pt-br' ]
};
