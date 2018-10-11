/**
 * @file shop command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let guildShop = await message.client.db.get(`SELECT roles, custom FROM guildShop WHERE guildID=${message.guild.id}`);

    let itemsInShop;
    if (guildShop && guildShop.custom) {
      itemsInShop = await ESXBot.functions.decodeString(guildShop.custom);
      itemsInShop = JSON.parse(itemsInShop);
    }
    else {
      itemsInShop = [];
    }

    if (args.add && args.item) {
      if (!message.member || !message.member.hasPermission('MANAGE_GUILD')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_GUILD');
      }

      if (itemsInShop.length >= 25) {
        return ESXBot.emit('error', '', 'You can\'t add more than 25 items for sale.', message.channel);
      }

      args.add = Math.abs(args.add);

      args.item = args.item.join(' ');

      if (args.item.length > 25) {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'invalidInput'), 'Name of the item should be less than 25 characters.', message.channel);
      }

      itemsInShop.push({
        name: args.item,
        value: args.add
      });

      itemsInShop = JSON.stringify(itemsInShop);
      itemsInShop = await ESXBot.functions.encodeString(itemsInShop);

      await ESXBot.db.run('INSERT OR REPLACE INTO guildShop VALUES(?, ?, ?)', [
        message.guild.id,
        (guildShop && guildShop.roles) || null,
        itemsInShop
      ]);

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          description: `Listed **${args.item}** for sale in the Shop for **${args.add}** ESXBot Moedas.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else if (args.remove) {
      if (!message.member || !message.member.hasPermission('MANAGE_GUILD')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_GUILD');
      }

      args.remove = Math.abs(args.remove);

      if (args.remove > itemsInShop.length) {
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'indexRange', true), message.channel);
      }

      let deletedItem = itemsInShop.splice(args.remove - 1, 1);

      itemsInShop = JSON.stringify(itemsInShop);
      itemsInShop = await ESXBot.functions.encodeString(itemsInShop);

      await ESXBot.db.run('INSERT OR REPLACE INTO guildShop VALUES(?, ?, ?)', [
        message.guild.id,
        (guildShop && guildShop.roles) || null,
        itemsInShop
      ]);

      message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          description: `Unlisted **${deletedItem[0].name}** from the Shop.`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      if (itemsInShop.length) {
        itemsInShop = itemsInShop.map((item, i) => {
          return {
            name: `${i + 1}. ${item.name}`,
            value: `${item.value} ESXBot Moedas`,
            inline: true
          };
        });

        message.channel.send({
          embed: {
            color: ESXBot.colors.BLUE,
            title: 'Shop',
            description: 'Buy any item using the `buy` command.\nUse `help buy` command for more info.',
            fields: itemsInShop
          }
        }).catch(e => {
          ESXBot.log.error(e);
        });
      }
      else {
        message.channel.send({
          embed: {
            color: ESXBot.colors.RED,
            title: 'Shop',
            description: 'No item\'s for sale in this server at this time.'
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
  aliases: [ 'store' ],
  enabled: true,
  argsDefinitions: [
    { name: 'item', type: String, multiple: true, defaultOption: true },
    { name: 'add', type: Number, alias: 'a' },
    { name: 'remove', type: Number, alias: 'r' }
  ]
};

exports.help = {
  name: 'shop',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shop [ --add AMOUNT ITEM_NAME | --remove ITEM_INDEX ]',
  example: [ 'shop', 'shop --add 100 The Coolest Hoodie', 'shop --remove 2' ]
};
