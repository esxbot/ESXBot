/**
 * @file messageUpdate event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const credentialsFilter = require('../utils/credentialsFilter');
const wordFilter = require('../utils/wordFilter');
const linkFilter = require('../utils/linkFilter');
const inviteFilter = require('../utils/inviteFilter');

module.exports = (oldMessage, newMessage) => {
  // If message content hasn't been changed, do nothing
  if (oldMessage.content === newMessage.content) return;

  /**
   * Filter ESXBot's credentials from the message
   */
  credentialsFilter(newMessage);

  if (!oldMessage.guild) return;
  if (newMessage.author.bot) return;

  /**
   * Filter specific words from the message
   */
  wordFilter(newMessage);

  /**
   * Filter links from the message
   */
  linkFilter(newMessage);

  /**
   * Filter Discord server invites from the message
   */
  inviteFilter(newMessage);
};
