/**
 * @file musicChannel command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let musicTextChannel, musicVoiceChannel, color, description;

    if (args.remove) {
      await ESXBot.db.run(`UPDATE guildSettings SET musicTextChannel=null, musicVoiceChannel=null WHERE guildID=${message.guild.id}`);
      color = ESXBot.colors.RED;
      description = ESXBot.strings.info(message.guild.language, 'removeMusicChannels', message.author.tag);
    }
    else if (args.id) {
      musicTextChannel = message.channel;
      musicVoiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(args.id);
      if (musicVoiceChannel) {
        await ESXBot.db.run(`UPDATE guildSettings SET musicTextChannel=${musicTextChannel.id}, musicVoiceChannel=${musicVoiceChannel.id} WHERE guildID=${message.guild.id}`);
        color = ESXBot.colors.GREEN;
        description = ESXBot.strings.info(message.guild.language, 'addMusicChannels', message.author.tag, musicTextChannel, musicVoiceChannel.name);
      }
      else {
        color = ESXBot.colors.RED;
        description = 'ID do canal de voz inválido para o canal de música.';
      }
    }
    else {
      if (message.guild.music.textChannelID) {
        musicTextChannel = message.guild.channels.filter(c => c.type === 'text').get(message.guild.music.textChannelID);
      }
      if (message.guild.music.voiceChannelID) {
        musicVoiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(message.guild.music.voiceChannelID);
      }

      if (!musicTextChannel || !musicVoiceChannel) {
        color = ESXBot.colors.RED;
        description = 'Canais de música não foram definidos.';
      }
      else {
        color = ESXBot.colors.BLUE;
        description = ESXBot.strings.info(message.guild.language, 'musicChannels', musicTextChannel, musicVoiceChannel.name);
      }
    }

    message.channel.send({
      embed: {
        color: color,
        title: 'Canal de música',
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
    { name: 'id', type: String, defaultOption: true },
    { name: 'remove', alias: 'r', type: Boolean }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'musicChannel',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'musicChannel [VOICE_CHANNEL_ID] [--remove]',
  example: [ 'musicChannel 308278968078041098', 'musicChannel', 'musicChannel --remove' ]
};
