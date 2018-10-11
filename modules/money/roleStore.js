/**
 * @file roleStore command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let guildShop = await message.client.db.get(`SELECT roles, custom FROM guildShop WHERE guildID=${message.guild.id}`);

    let rolesInStore;
    if (guildShop && guildShop.roles) {
      rolesInStore = await ESXBot.functions.decodeString(guildShop.roles);
      rolesInStore = JSON.parse(rolesInStore);
    }
    else {
      rolesInStore = {};
    }

    if (args.add) {
      if (!message.member || !message.member.hasPermission('MANAGE_ROLES')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_ROLES');
      }

      if (Object.keys(rolesInStore).length >= 25) {
        return ESXBot.emit('error', '', 'Você não pode adicionar mais de 25 funções à venda.', message.channel);
      }

      args.add = Math.abs(args.add);

      let role = message.guild.roles.get(args.role);

      if (!role) {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
      }

      rolesInStore[role.id] = args.add;

      rolesInStore = JSON.stringify(rolesInStore);
      rolesInStore = await ESXBot.functions.encodeString(rolesInStore);

      await ESXBot.db.run('INSERT OR REPLACE INTO guildShop VALUES(?, ?, ?)', [
        message.guild.id,
        rolesInStore,
        (guildShop && guildShop.custom) || null
      ]);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `Listados **${role.name}** função para venda na loja de funções para **${args.add}** ESXBot Moedas.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else if (args.remove) {
      if (!message.member || !message.member.hasPermission('MANAGE_ROLES')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_ROLES');
      }

      delete rolesInStore[args.role];

      rolesInStore = JSON.stringify(rolesInStore);
      rolesInStore = await ESXBot.functions.encodeString(rolesInStore);

      await ESXBot.db.run('INSERT OR REPLACE INTO guildShop VALUES(?, ?, ?)', [
        message.guild.id,
        rolesInStore,
        (guildShop && guildShop.custom) || null
      ]);

      let role;
      if (message.guild.roles.has(args.role)) {
        role = message.guild.roles.get(args.role).name;
      }
      else {
        role = args.role;
      }

      message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          description: `Não-listado **${role}** função da Loja de Funções`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      let roles = Object.keys(rolesInStore).filter(role => message.guild.roles.has(role)).map(role => message.guild.roles.get(role));

      if (roles.length) {
        let fields = [];
        for (let role of roles) {
          fields.push({
            name: `${role.name} (${role.id})`,
            value: `${rolesInStore[role.id]} ESXBot Moedas`
          });
        }

        message.channel.send({
          embed: {
            color: ESXBot.colors.BLUE,
            title: 'Loja de Funções',
            description: 'Compre uma função usando o comando `buyRole`.\nUse o comando `help buyRole` para mais informações.',
            fields: fields
          }
        }).catch(e => {
          ESXBot.log.error(e);
        });
      }
      else {
        message.channel.send({
          embed: {
            color: ESXBot.colors.RED,
            title: 'Loja de Funções',
            description: 'Nenhuma função está à venda neste servidor neste momento.'
          }
        }).catch(e => {
          ESXBot.log.error(e);
        });
      }
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'roleShop' ],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, defaultOption: true },
    { name: 'add', type: Number, alias: 'a' },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'roleStore',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roleStore [ --add AMOUNT ROLE_ID | --remove ROLE_ID ]',
  example: [ 'roleStore', 'roleStore --add 100 277132449585713251', 'roleStore --remove 277132449585713251' ]
};
