/**
 * @file leaderboard command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let profiles = await ESXBot.db.all('SELECT userID, level, xp, esxbotCurrencies FROM profiles ORDER BY level * 1 DESC, xp * 1 DESC, esxbotCurrencies * 1 DESC');

    let fields = [];

    if (!args.global) {
      profiles = profiles.filter(p => message.guild.members.get(p.userID));
    }

    let noOfPages = profiles.length / 10;
    let p = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    p = p - 1;
    profiles = profiles.slice(p * 10, (p * 10) + 10);

    for (let i = 0; i < profiles.length; i++) {
      let user;
      if (message.guild.members.has(profiles[i].userID)) {
        let member = await message.guild.fetchMember(profiles[i].userID);
        user = `${member.user.tag} - ${member.id}`;
      }
      else {
        user = profiles[i].userID;
      }
      fields.push({
        name: `${i + 1 + (p * 10)}. ${user}`,
        value: `Nível: ${profiles[i].level}\tPontos de experiência: ${profiles[i].xp}\tESXBot Moedas: ${profiles[i].esxbotCurrencies}`
      });
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: 'Entre os melhores',
        description: 'Estes são os usuários no topo do gráfico!',
        fields: fields,
        footer: {
          text: `Página: ${p + 1} de ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
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
  aliases: [ 'lb', 'hallOfFame', 'hof' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 },
    { name: 'global', type: Boolean, alias: 'g' }
  ]
};

exports.help = {
  name: 'leaderboard',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leaderboard [PAGE_NO] [--global]',
  example: [ 'leaderboard', 'leaderboard 3', 'leaderboard --global', 'leaderboard 2 --global' ]
};
