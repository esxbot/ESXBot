/**
 * @file claim command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

let claimedUsers = [];
const specialIDs = require('../../data/specialIDs.json');

exports.exec = (ESXBot, message) => {
  if (!claimedUsers.includes(message.author.id)) {
    let rewardAmount = ESXBot.functions.getRandomInt(50, 100);

    let rewardMessage;
    if (ESXBot.user.id === '290205363414892545') {
      if (message.guild.id === specialIDs.esxbotGuild) {
        if (message.createdAt - message.member.joinedAt > 86400000) {
          rewardAmount *= 2;
          if (message.member && message.member.roles.has(specialIDs.patronsRole)) {
            rewardAmount += 500;
          }
          else if (message.member && message.member.roles.has(specialIDs.donorsRole)) {
            rewardAmount += 100;
          }

          rewardMessage = `Sua conta foi debitada com **${rewardAmount}** ESXBot Moedas.`;
        }
        else {
          rewardMessage = `Sua conta foi debitada com **${rewardAmount}** ESXBot Moedas.\n\n`
            + '💡 **Dica Pro**\nVocê precisa ser um membro de [ESXBot HQ](https://discord.gg/8zGbh3T) por pelo menos um dia para chegar **2x** ESXBot Bônus de moedas.';
        }
      }
      else {
        rewardMessage = `Sua conta foi debitada com **${rewardAmount}** ESXBot Moedas.\n\n`
          + '💡 **Dica Pro**\nVocê pode ter **2x** mais ESXBot Moedas quando você usa o comando `claim` ou `daily` em [ESXBot HQ](https://discord.gg/8zGbh3T): https://discord.gg/8zGbh3T';
      }
    }
    else {
      rewardMessage = `Sua conta foi debitada com **${rewardAmount}** ESXBot Moedas.`;
    }

    ESXBot.emit('userDebit', message.author, rewardAmount);
    claimedUsers.push(message.author.id);
    setTimeout(() => {
      claimedUsers.splice(claimedUsers.indexOf(message.author.id), 1);
    }, ESXBot.functions.msUntilMidnight());

    /**
    * Send a message in the channel to let the user know that the operation was successful.
    */
    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: `${message.author} Você reivindicou sua recompensa diária. Por favor, verifique minha mensagem em seu DM para ver o valor da recompensa.`
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });

    /**
    * Let the user know by DM that their account has been debited.
    */
    message.author.send({
      embed: {
        color: ESXBot.colors.GREEN,
        description: rewardMessage
      }
    }).catch(e => {
      if (e.code !== 50007) {
        ESXBot.log.error(e);
      }
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'cooldown'), ESXBot.strings.error(message.guild.language, 'claimCooldown', true, message.author), message.channel);
  }
};

exports.config = {
  aliases: [ 'daily' ],
  enabled: true
};

exports.help = {
  name: 'claim',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'claim',
  example: []
};
