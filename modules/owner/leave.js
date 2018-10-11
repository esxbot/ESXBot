/**
 * @file leave command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!(parseInt(args[0]) < 9223372036854775807)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let guild, found = true;
    if (ESXBot.shard) {
      guild = await ESXBot.shard.broadcastEval(`this.guilds.get('${args[0]}') && this.guilds.get('${args[0]}').leave().catch(e => this.log.error(e))`);
      guild = guild.filter(g => g);
      if (!guild.length) {
        found = false;
      }
    }
    else {
      guild = ESXBot.guilds.get(args[0]);
      if (!guild) {
        found = false;
      }
      await guild.leave();
    }

    if (found) {
      message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          description: `I've left the${ESXBot.shard ? ' ' : ` **${guild.name}** `}Discord server with the ID **${args[0]}**.`
        }
      });
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'Discord server'), message.channel);
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'leave',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leave <guild_id>',
  example: [ 'leave 441122339988775566' ]
};
