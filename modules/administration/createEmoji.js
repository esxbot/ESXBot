/**
 * @file createEmoji command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.url || !/^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png)$/i.test(args.url) || !args.name) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let emoji = await message.guild.createEmoji(args.url, args.name.join('_'));

    await message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: ESXBot.strings.info(message.guild.language, 'createEmoji', message.author.tag, emoji.name)
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 50035) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), 'File cannot be larger than 256 KB.', message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'url', type: String, defaultOption: true },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'createEmoji',
  botPermission: 'MANAGE_EMOJIS',
  userTextPermission: 'MANAGE_EMOJIS',
  userVoicePermission: '',
  usage: 'createEmoji <EmojiURL> -n <EmojiName>',
  example: [ 'createEmoji https://esxbot.github.io/assets/images/esxbot.png -n ESXBot' ]
};
