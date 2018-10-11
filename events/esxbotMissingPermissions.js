/**
 * @file esxbotMissingPermissions event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = (permissions, message) => {
  if (!message) return;

  message.channel.send({
    embed: {
      color: message.client.colors.RED,
      description: message.client.strings.error(message.guild.language, 'esxbotMissingPermissions', true, permissions.replace('_', ' '))
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
