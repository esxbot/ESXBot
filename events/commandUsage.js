/**
 * @file commandUsage event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = (message, command) => {
  message.channel.send({
    embed: {
      color: message.client.colors.RED,
      title: message.client.strings.error(message.guild.language, 'invalidUse'),
      description: `Não é assim que você usa o comando \`${command.name}\`.`,
      fields: [
        {
          name: 'Obter ajuda',
          value: `Use o \`${message.guild.prefix[0]}help ${command.name}\` comando para ver o uso e exemplo do comando \`${command.name}\`.\nVocê também pode participar **ESXBot HQ** e nossa incrível equipe de suporte irá ajudá-lo: https://discord.gg/8zGbh3T`
        }
      ]
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
