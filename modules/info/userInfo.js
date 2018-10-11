/**
 * @file userInfo command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let user, member;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      member = await message.guild.fetchMember(args.id);
      if (member) {
        user = member.user;
      }
    }
    if (!user) {
      user = message.author;
    }
    if (!member) {
      member = await message.guild.fetchMember(user.id);
    }
    let nick = member.nickname;
    if (!nick) {
      nick = '-';
    }
    let status = user.presence.status;
    if (status === 'online') {
      status = 'Online';
    }
    else if (status === 'idle') {
      status = 'Ocioso';
    }
    else if (status === 'dnd') {
      status = 'Não perturbe';
    }
    else {
      status = 'Offline';
    }
    let activity;
    if (user.presence.game) {
      activity = `${ESXBot.Constants.ActivityTypes[user.presence.game.type]} ${user.presence.game.name}`;
    }
    else {
      activity = 'Nenhum';
    }
    let roles = member.roles.map(r => r.name).slice(1).join('\n');
    if (roles.length === 0) roles = '-';

    let mutualGuilds = await ESXBot.functions.getMutualGuilds(user);

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: `${user.bot ? 'Bot' : 'User'} Info`,
        fields: [
          {
            name: 'Nome',
            value: user.tag,
            inline: true
          },
          {
            name: 'ID',
            value: user.id,
            inline: true
          },
          {
            name: 'Apelido',
            value: nick,
            inline: true
          },
          {
            name: 'Funções',
            value: roles,
            inline: true
          },
          {
            name: 'Entrou no servidor',
            value: member.joinedAt.toUTCString(),
            inline: true
          },
          {
            name: 'Entrou no discord',
            value: user.createdAt.toUTCString(),
            inline: true
          },
          {
            name: 'Status',
            value: status,
            inline: true
          },
          {
            name: 'Atividade',
            value: activity,
            inline: true
          }
        ],
        thumbnail: {
          url: user.displayAvatarURL
        },
        footer: {
          text: `${message.guild.ownerID === user.id ? 'Proprietário do servidor •' : ''} Compartilhou ${mutualGuilds} servidores comigo.`,
          icon_url: `${message.guild.ownerID === user.id ? 'https://i.imgur.com/2ogsleu.png' : ''}`
        }
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
  aliases: [ 'uinfo' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'userInfo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'userInfo [@USER_MENTION | USER_ID]',
  example: [ 'userInfo @user#0001', 'userInfo 167122669385743441', 'userInfo' ]
};
