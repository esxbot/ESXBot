/**
 * @file streamers command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let streamers = await ESXBot.db.get(`SELECT channelID, twitch FROM streamers WHERE guildID=${message.guild.id}`);
    let twitchStreamers = [], color, title, description;

    if (streamers && streamers.twitch.split(' ').length) {
      twitchStreamers = streamers.twitch.split(' ');
    }

    if (!args.streamers) {
      if (twitchStreamers.length) {
        color = ESXBot.colors.BLUE;
        title = 'Followed streamers';
        description = twitchStreamers.join(', ');
      }
      else {
        color = ESXBot.colors.RED;
        description = 'You\'re not following any streamers in this server.';
      }
    }
    else {
      if (args.remove) {
        color = ESXBot.colors.RED;
        title = 'Removed from followed streamers';
        twitchStreamers = twitchStreamers.filter(streamer => args.streamers.indexOf(streamer) < 0);
      }
      else {
        color = ESXBot.colors.GREEN;
        title = 'Added to followed streamers';
        twitchStreamers = twitchStreamers.concat(args.streamers);
      }
      description = args.streamers.join(' ');
      twitchStreamers = [ ...new Set(twitchStreamers) ];
      await ESXBot.db.run('INSERT OR REPLACE INTO streamers(guildID, channelID, twitch) VALUES(?, ?, ?)', [ message.guild.id, message.channel.id, twitchStreamers.join(' ') ]);
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
        description: description
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
    { name: 'streamers', type: String, multiple: true, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'streamers',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'streamers [user1 [user2]] [--remove]',
  example: [ 'streamers', 'streamers k3rn31p4nic Wipe Taafe', 'streamers k3rn31p4nic --remove' ]
};
