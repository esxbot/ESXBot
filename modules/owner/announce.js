/**
 * @file announce command
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

    let guildSettings = await ESXBot.db.all('SELECT announcementChannel FROM guildSettings');
    let announcementChannels = guildSettings.map(guild => guild.announcementChannel).filter(channel => channel);
    let announcementMessage = args.join(' ');

    for (let channel of announcementChannels) {
      if (ESXBot.shard) {
        await ESXBot.shard.broadcastEval(`
          let channel = this.channels.get('${channel}');
          if (channel) {
            channel.send({
              embed: {
                color: this.colors.BLUE,
                description: \`${announcementMessage.replace('\'', '\\\'')}\`
              }
            }).catch(this.log.error);
          }
        `);
      }
      else {
        await ESXBot.channels.get(channel).send({
          embed: {
            color: ESXBot.colors.BLUE,
            description: announcementMessage
          }
        }).catch(() => {});
      }
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Announced',
        description: announcementMessage
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
  aliases: [ 'notify' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'announce',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'announce <message>',
  example: [ 'announce Just a random announcement.' ]
};
