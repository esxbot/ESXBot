/**
 * @file setActivity command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.name) {
      args.name = args.name.join(' ');

      await ESXBot.user.setActivity(args.name, { type: args.type });

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `My activity is now set to **${args.type} ${args.name}**`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      let game = typeof ESXBot.config.game.name === 'string' ? ESXBot.config.game.name : ESXBot.config.game.name.length ? ESXBot.config.game.name[0] : null;
      await ESXBot.user.setActivity(game, { type: ESXBot.config.game.type });

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `My activity has been reset to the default: **${ESXBot.config.game.type} ${game}**`
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
  aliases: [ 'setGame' ],
  enabled: true,
  ownerOnly: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true },
    { name: 'type', type: String, alias: 't', defaultValue: 'Playing' }
  ]
};

exports.help = {
  name: 'setActivity',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setActivity [ ACTIVITY NAME [-t ACTIVITY_TYPE] ]',
  example: [ 'setActivity minions! -t Watching', 'setActivity with you', 'setActivity' ]
};
