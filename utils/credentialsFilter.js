/**
 * @file credentialsFilter
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

/**
 * Handles filtering of ESXBot's credentials contained in messages
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    /**
    * Filter Discord client token
    */
    if (message.content.includes(message.client.token)) {
      if (message.deletable) {
        message.delete().catch(e => {
          message.client.log.error(e);
        });
      }

      let app = await message.client.fetchApplication();
      let owner = await message.client.fetchUser(app.owner.id);

      owner.send({
        embed: {
          color: message.client.colors.RED,
          title: 'ATENÇÃO!',
          description: 'Meu token foi exposto! Por favor regenere **ASAP** para evitar o uso malicioso por outros.',
          fields: [
            {
              name: 'Usuário responsável',
              value: `${message.author.tag} - ${message.author.id}`
            }
          ]
        }
      }).catch(e => {
        message.client.log.error(e);
      });
      return true;
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
