/**
 * @file votingChannels command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let guildSettings = await ESXBot.db.get(`SELECT votingChannels FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, title, votingChannelsStats;
    if (guildSettings.votingChannels) {
      guildSettings.votingChannels = guildSettings.votingChannels.split(' ');
    }
    else {
      guildSettings.votingChannels = [];
    }

    if (args.add) {
      guildSettings.votingChannels.push(message.channel.id);
      guildSettings.votingChannels = [ ...new Set(guildSettings.votingChannels) ];

      if (guildSettings.votingChannels.length > 3) {
        color = ESXBot.colors.RED;
        votingChannelsStats = 'You can\'t set more than 3 voting channels in a server for now. Remove another voting channel before setting this channel as a voting channel.\nWe will increase this limit in the future.';
      }
      else {
        await ESXBot.db.run(`UPDATE guildSettings SET votingChannels='${guildSettings.votingChannels.join(' ')}' WHERE guildID=${message.guild.id}`);

        color = ESXBot.colors.GREEN;
        votingChannelsStats = `${message.channel} has been added to the list of voting channels.`;
      }
    }
    else if (args.remove) {
      guildSettings.votingChannels.splice(guildSettings.votingChannels.indexOf(message.channel.id), 1);
      await ESXBot.db.run(`UPDATE guildSettings SET votingChannels='${guildSettings.votingChannels.join(' ')}' WHERE guildID=${message.guild.id}`);

      color = ESXBot.colors.RED;
      votingChannelsStats = `${message.channel} has been removed from the list of voting channels.`;
    }
    else if (args.prune) {
      await ESXBot.db.run(`UPDATE guildSettings SET votingChannels=null WHERE guildID=${message.guild.id}`);

      color = ESXBot.colors.RED;
      votingChannelsStats = 'All the channels have been removed from the list of voting channels.';
    }
    else {
      if (guildSettings.votingChannels.length) {
        guildSettings.votingChannels = guildSettings.votingChannels.map(channel => message.guild.channels.get(channel));
        color = ESXBot.colors.BLUE;
        title = 'Voting Channels';
        votingChannelsStats = `Messages posted in the voting channels can are available for upvote/downvote by users.\nThese channels have been set as the voting channels:\n\n${guildSettings.votingChannels.join('\n\n')}`;
      }
      else {
        color = ESXBot.colors.RED;
        votingChannelsStats = 'No voting channels have been set in this server.';
      }
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
        description: votingChannelsStats
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
    { name: 'add', type: Boolean, alias: 'a' },
    { name: 'remove', type: Boolean, alias: 'r' },
    { name: 'prune', type: Boolean, alias: 'p' }
  ]
};

exports.help = {
  name: 'votingChannels',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'votingChannels [ --add | --remove | --prune ]',
  example: [ 'votingChannels', 'votingChannels --add', 'votingChannels --remove', 'votingChannels --prune' ]
};
