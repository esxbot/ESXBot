/**
 * @file profile command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const specialIDs = require('../../data/specialIDs.json');

exports.exec = async (ESXBot, message, args) => {
  try {
    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await message.guild.fetchMember(args.id);
      if (user) {
        user = user.user;
      }
    }
    if (!user) {
      user = message.author;
    }

    let profile = await ESXBot.db.get(`SELECT p1.*, (SELECT COUNT(*) FROM profiles AS p2 WHERE p2.xp * 1 > p1.xp * 1) AS rank FROM profiles as p1 WHERE p1.userID=${user.id}`);

    if (!profile) {
      if (user.id === message.author.id) {
        return message.channel.send({
          embed: {
            color: ESXBot.colors.GREEN,
            description: `Seu perfil agora esta criado <@${user.id}>`
          }
        }).catch(e => {
          ESXBot.log.error(e);
        });
      }

      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'profileNotCreated', true, `<@${user.id}>`), message.channel);
    }

    if (profile.bio) {
      profile.bio = await ESXBot.functions.decodeString(profile.bio);
    }
    else {
      profile.bio = `Nenhuma bio foi definida. ${user.id === message.author.id ? 'Defina sua biografia usando o comando `setBio`.' : ''}`;
    }

    let profileData = [
      {
        name: 'ESXBot Moeda',
        value: profile.esxbotCurrencies,
        inline: true
      },
      {
        name: 'Rank',
        value: parseInt(profile.rank) + 1,
        inline: true
      },
      {
        name: 'Pontos de experiência',
        value: profile.xp,
        inline: true
      },
      {
        name: 'Nível',
        value: profile.level,
        inline: true
      }
    ];

    if (profile.birthDate) {
      profileData.push({
        name: 'Aniversário',
        value: new Date(profile.birthDate).toDateString().split(' ').splice(1, 2).join(' '),
        inline: true
      });
    }
    if (profile.location) {
      profileData.push({
        name: 'Localização',
        value: profile.location,
        inline: true
      });
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        author: {
          name: user.tag,
          icon_url: await getUserIcon(user)
        },
        description: profile.bio,
        fields: profileData,
        thumbnail: {
          url: user.displayAvatarURL
        },
        footer: {
          text: `${profile.reputation} Reputação${parseInt(profile.reputation) === 1 ? '' : 's'}`
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
  aliases: ['perfil'],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'profile',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'profile [@USER_MENTION | USER_ID]',
  example: [ 'profile', 'profile @ESXBot#0001', 'profile 167433345337713651' ]
};

/**
 * Returns the provided user's staff icon
 * @function getUserIcon
 * @param {User} user The user for which we need to get the icon
 * @returns {String} The url of the user's staff icon
 */
async function getUserIcon(user) {
  try {
    const esxbotGuildID = specialIDs.esxbotGuild;
    const esxbotGuild = user.client.guilds.get(esxbotGuildID);
    if (!esxbotGuild) return;
    const esxbotGuildMember = await esxbotGuild.fetchMember(user.id);
    if (!esxbotGuildMember) return;

    const devRoleID = specialIDs.developerRole;
    const contributorsRoleID = specialIDs.contributorsRole;
    const donorsRoleID = specialIDs.donorsRole;
    const modsRoleID = specialIDs.modsRole;
    const patronsRoleID = specialIDs.patronsRole;
    const supportRoleID = specialIDs.supportRole;
    const testersRoleID = specialIDs.testersRole;
    const translatorsRoleID = specialIDs.translatorsRole;

    const devIcon = 'https://i.imgur.com/ThSx8bZ.png';
    const modsIcon = 'https://i.imgur.com/vntgkTs.png';
    const contributorsIcon = 'https://i.imgur.com/kH49M8d.png';
    const donorsIcon = 'https://i.imgur.com/0Jfh057.png';
    const patronsIcon = 'https://i.imgur.com/VZePUfw.png';
    const supportIcon = 'http://i.imgur.com/HM9UD6w.png';
    const testersIcon = 'https://i.imgur.com/fVIW1Uy.png';
    const translatorsIcon = 'https://i.imgur.com/COwpvnK.png';
    // const partners = 'https://cdn.discordapp.com/emojis/314068430556758017.png';
    // const hype = 'https://cdn.discordapp.com/emojis/314068430854684672.png';
    // const nitro = 'https://cdn.discordapp.com/emojis/314068430611415041.png';

    if (esxbotGuildMember.roles.has(devRoleID)) {
      return devIcon;
    }
    if (esxbotGuildMember.roles.has(modsRoleID)) {
      return modsIcon;
    }
    else if (esxbotGuildMember.roles.has(contributorsRoleID)) {
      return contributorsIcon;
    }
    else if (esxbotGuildMember.roles.has(supportRoleID)) {
      return supportIcon;
    }
    else if (esxbotGuildMember.roles.has(patronsRoleID)) {
      return patronsIcon;
    }
    else if (esxbotGuildMember.roles.has(donorsRoleID)) {
      return donorsIcon;
    }
    else if (esxbotGuildMember.roles.has(testersRoleID)) {
      return testersIcon;
    }
    else if (esxbotGuildMember.roles.has(translatorsRoleID)) {
      return translatorsIcon;
    }
  }
  catch (e) {
    process.stderr.write(`${e}\n`);
  }
}
