/**
 * @file myItems command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message) => {
  try {
    let color, title, description;

    let userItems = await ESXBot.db.get(`SELECT custom_items FROM shop_items WHERE userID='${message.author.id}' AND guildID='${message.guild.id}'`);

    if (userItems && userItems.custom_items) {
      userItems = await ESXBot.functions.decodeString(userItems.custom_items);
      userItems = JSON.parse(userItems);
    }
    else {
      userItems = [];
    }

    if (userItems.length) {
      color = ESXBot.colors.BLUE;
      title = `Itens disponíveis com ${message.author.tag}`;
      description = userItems.join(', ');
    }
    else {
      color = ESXBot.colors.RED;
      title = 'Não encontrado';
      description = 'Você não tem nenhum item com você neste servidor.';
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
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
  enabled: true
};

exports.help = {
  name: 'myItems',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'myItems',
  example: []
};
