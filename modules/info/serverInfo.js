/**
 * @file serverInfo command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  let nonAnimatedEmojis = message.guild.emojis.filter(emoji => !emoji.animated);
  let guildEmojis = nonAnimatedEmojis.size > 0 ? nonAnimatedEmojis.size > 25 ? `${nonAnimatedEmojis.map(e => `<:${e.name}:${e.id}>`).splice(0, 25).join(' ')} and ${nonAnimatedEmojis.size - 25} more.` : nonAnimatedEmojis.map(e => `<:${e.name}:${e.id}>`).join(' ') : '-';

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Informações do servidor',
      fields: [
        {
          name: 'Nome',
          value: message.guild.name,
          inline: true
        },
        {
          name: 'ID',
          value: message.guild.id,
          inline: true
        },
        {
          name: 'Proprietário',
          value: message.guild.owner.user.tag,
          inline: true
        },
        {
          name: 'ID do proprietário',
          value: message.guild.ownerID,
          inline: true
        },
        {
          name: 'Criado em',
          value: message.guild.createdAt.toUTCString(),
          inline: true
        },
        {
          name: 'Região',
          value: message.guild.region.toUpperCase(),
          inline: true
        },
        {
          name: 'Funções',
          value: message.guild.roles.size - 1,
          inline: true
        },
        {
          name: 'Membros',
          value: `${message.guild.members.filter(m => !m.user.bot).size} Usuários em cache\n${message.guild.members.filter(m => m.user.bot).size} BOTs em cache`,
          inline: true
        },
        {
          name: 'Canais de texto',
          value: message.guild.channels.filter(channel => channel.type === 'text').size,
          inline: true
        },
        {
          name: 'Canais de voz',
          value: message.guild.channels.filter(channel => channel.type === 'voice').size,
          inline: true
        },
        {
          name: 'Emojis do servidor',
          value: guildEmojis
        }
      ],
      thumbnail: {
        url: message.guild.icon ? message.guild.iconURL : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(message.guild.nameAcronym)}`
      },
      image: {
        url: message.guild.splash ? message.guild.splashURL : null
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'sinfo' ],
  enabled: true
};

exports.help = {
  name: 'serverInfo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'serverInfo',
  example: []
};
