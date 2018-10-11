/**
 * @file giveXP command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.id || !args.points) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    if (message.mentions.users.size) {
      args.id = message.mentions.users.first().id;
    }

    let profile = await message.client.db.get(`SELECT xp FROM profiles WHERE userID=${args.id}`);
    if (!profile) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'profileNotCreated', true, `<@${args.id}>`), message.channel);
    }

    args.points = `${parseInt(profile.xp) + parseInt(args.points)}`;

    await message.client.db.run(`UPDATE profiles SET xp=${args.points} WHERE userID=${args.id}`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: `<@${args.id}> foi premiado com **${args.points}** pontos de experiência.`
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
  ownerOnly: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'points', alias: 'n', type: String }
  ]
};

exports.help = {
  name: 'giveXP',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'giveXP <@USER_MENTION | USER_ID> <-n POINTS>',
  example: [ 'giveXP @user#0001 -n 100', 'giveXP 242621467230268813 -n 150' ]
};
