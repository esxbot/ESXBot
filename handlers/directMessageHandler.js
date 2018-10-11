/**
 * @file directMessageHandler
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

/**
 * Handles direct messages sent to ESXBot
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = message => {
  let prefix = message.client.config.prefix;

  if (message.content.startsWith(prefix)) {
    let args = message.content.split(' ');
    let command = args.shift().slice(prefix.length).toLowerCase();

    if (command === 'help' || command === 'h') {
      return message.channel.send({
        embed: {
          color: message.client.colors.BLUE,
          title: 'ESXBot',
          url: 'https://esxbot.github.io',
          description: 'Entrer [**ESXBot HQ**](https://discord.gg/8zGbh3T) para testar o ESXBot e seus comandos, para eventos gratuitos, para conversar e para muita diversão!',
          fields: [
            {
              name: 'ESXBot HQ Convidar Link',
              value: 'https://discord.gg/8zGbh3T'
            },
            {
              name: 'Bot ESXBot Convidar Link',
              value: `https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=2146958463`
            }
          ],
          thumbnail: {
            url: message.client.user.displayAvatarURL
          },
          footer: {
            text: '</> feito com ❤ por Renildo Marcio'
          }
        }
      }).catch(e => {
        message.client.log.error(e);
      });
    }
  }
};
