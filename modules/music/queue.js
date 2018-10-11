/**
 * @file queue command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (message.guild.music.textChannelID && message.channel.id !== message.guild.music.textChannelID) return ESXBot.log.info('Music channels have been set, so music commands will only work in the music text channel.');

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'emptyQueue'), ESXBot.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  let songs = message.guild.music.songs.slice(1);
  songs = songs.map((song, i) => `**${i + 1}.** ${song.title}`);

  let noOfPages = songs.length / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  message.guild.music.textChannel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Fila de música',
      fields: [
        {
          name: 'Tocando agora',
          value: `${message.guild.music.songs[0].title}\n\n*Requerido por ${message.guild.music.songs[0].requester}*`
        },
        {
          name: 'A seguir',
          value: songs.slice(i * 10, (i * 10) + 10).join('\n\n') || 'Nada será reproduzido em seguida, adicione músicas à fila usando o comando `play` .'
        }
      ],
      footer: {
        text: `Página: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)} • ${message.guild.music.songs.length - 1} músicas na fila`
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'queue',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'queue <PAGE_NO>',
  example: [ 'queue', 'queue 2' ]
};
