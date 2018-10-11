/**
 * @file buyRole command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.role) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    args.role = args.role.join(' ');

    let role;
    if (message.guild.roles.has(args.role)) {
      role = message.guild.roles.get(args.role);
    }
    else {
      role = message.guild.roles.find('name', args.role);
    }
    if (!role) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    let guildShop = await message.client.db.get(`SELECT roles FROM guildShop WHERE guildID=${message.guild.id}`);

    let rolesInStore;
    if (guildShop && guildShop.roles) {
      rolesInStore = await ESXBot.functions.decodeString(guildShop.roles);
      rolesInStore = JSON.parse(rolesInStore);
    }
    else {
      rolesInStore = {};
    }

    let buyableRoles = Object.keys(rolesInStore).filter(role => message.guild.roles.has(role));
    if (buyableRoles.includes(role.id)) {
      let user = await ESXBot.db.get(`SELECT esxbotCurrencies FROM profiles WHERE userID=${message.author.id}`);
      user.esxbotCurrencies = parseInt(user.esxbotCurrencies);

      if (rolesInStore[role.id] > user.esxbotCurrencies) {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'insufficientBalance'), ESXBot.strings.error(message.guild.language, 'insufficientBalance', true, user.esxbotCurrencies), message.channel);
      }

      message.member.addRole(role);

      ESXBot.emit('userCredit', message.author, rolesInStore[role.id]);
      if (message.author.id !== message.guild.owner.id) {
        ESXBot.emit('userDebit', message.guild.owner, (0.9) * rolesInStore[role.id]);
      }

      message.channel.send({
        embed: {
          color: ESXBot.colors.BLUE,
          description: `${message.author.tag} comprou a função **${role.name}** por **${rolesInStore[role.id]}** ESXBot Moedas.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      return ESXBot.emit('error', 'Não está a venda', `A função **${role.name}** não está à venda.`, message.channel);
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'buyRole',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buyRole < ROLE NAME | ROLE_ID >',
  example: [ 'buyRole The Knights', 'buyRole 277132449585713251' ]
};
