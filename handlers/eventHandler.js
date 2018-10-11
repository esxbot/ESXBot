/**
 * @file Event Handler
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

/**
 * Loads the events
 * @function LOAD_EVENTS
 * @param {string} event Name of the event.
 * @returns {function} The event's function.
 */
const LOAD_EVENTS = event => require(`../events/${event}`);

/**
 * Handles/Loads all the events.
 * @module eventHandler
 * @param {object} ESXBot The ESXBot Object.
 * @returns {void}
 */
module.exports = ESXBot => {
  /**
   * Emitted whenever a channel is created.
   * @listens channelCreate
   */
  ESXBot.on('channelCreate', LOAD_EVENTS('channelCreate'));
  /**
   * Emitted whenever a channel is deleted.
   * @listens channelDelete
   */
  ESXBot.on('channelDelete', LOAD_EVENTS('channelDelete'));
  /**
   * Emitted whenever a channel is updated - e.g. name change, topic change.
   * @listens channelUpdate
   */
  ESXBot.on('channelUpdate', LOAD_EVENTS('channelUpdate'));
  /**
   * Emitted whenever ESXBot's WebSocket encounters a connection error.
   * Also handles other errors emitted by ESXBot.
   * @listens error
   */
  ESXBot.on('error', LOAD_EVENTS('error'));
  /**
   * Emitted whenever a member is banned from a guild.
   * @listens guildBanAdd
   */
  ESXBot.on('guildBanAdd', LOAD_EVENTS('guildBanAdd'));
  /**
   * Emitted whenever a member is unbanned from a guild.
   * @listens guildBanRemove
   */
  ESXBot.on('guildBanRemove', LOAD_EVENTS('guildBanRemove'));
  /**
   * Emitted whenever ESXBot joins a guild.
   * @listens guildCreate
   */
  ESXBot.on('guildCreate', LOAD_EVENTS('guildCreate'));
  /**
   * Emitted whenever a guild is deleted/left.
   * @listens guildDelete
   */
  ESXBot.on('guildDelete', LOAD_EVENTS('guildDelete'));
  /**
   * Emitted whenever a user joins a guild.
   * @listens guildMemberAdd
   */
  ESXBot.on('guildMemberAdd', LOAD_EVENTS('guildMemberAdd'));
  /**
   * Emitted whenever a member leaves a guild, or is kicked.
   * @listens guildMemberRemove
   */
  ESXBot.on('guildMemberRemove', LOAD_EVENTS('guildMemberRemove'));
  /**
   * Emitted whenever a member leaves a guild, or is kicked.
   * @listens guildMemberRemove
   */
  ESXBot.on('presenceUpdate', LOAD_EVENTS('presenceUpdate'));
  /**
   * Emitted whenever a guild is updated - e.g. name change.
   * @listens guildUpdate
   */
  ESXBot.on('guildUpdate', LOAD_EVENTS('guildUpdate'));
  /**
   * Emitted whenever a message is created.
   * @listens message
   */
  ESXBot.on('message', LOAD_EVENTS('message'));
  /**
   * Emitted whenever a reaction is added to a message.
   * @listens message
   */
  ESXBot.on('messageReactionAdd', LOAD_EVENTS('messageReactionAdd'));
  /**
   * Emitted whenever a message is updated - e.g. embed or content change.
   * @listens messageUpdate
   */
  ESXBot.on('messageUpdate', LOAD_EVENTS('messageUpdate'));
  /**
   * Emitted when ESXBot becomes ready to start working.
   * @listens ready
   */
  ESXBot.on('ready', () => LOAD_EVENTS('ready')(ESXBot));
  /**
   * Emitted whenever a role is created.
   * @listens roleCreate
   */
  ESXBot.on('roleCreate', LOAD_EVENTS('roleCreate'));
  /**
   * Emitted whenever a guild role is deleted.
   * @listens roleDelete
   */
  ESXBot.on('roleDelete', LOAD_EVENTS('roleDelete'));
  /**
   * Emitted whenever a guild role is updated.
   * @listens roleUpdate
   */
  ESXBot.on('roleUpdate', LOAD_EVENTS('roleUpdate'));
  /**
   * Emitted for general warnings.
   * @listens warn
   */
  ESXBot.on('warn', LOAD_EVENTS('warn'));

  /**
  * Emitted whenever ESXBot doesn't have the required permission(s).
  * @listens esxbotMissingPermissions
  */
  ESXBot.on('esxbotMissingPermissions', LOAD_EVENTS('esxbotMissingPermissions'));
  /**
   * Emitted whenever a command is used with invalid parameters.
   * @listens commandUsage
   */
  ESXBot.on('commandUsage', LOAD_EVENTS('commandUsage'));
  /**
   * Emitted whenever a moderation log event fires.
   * @listens moderationLog
   */
  ESXBot.on('moderationLog', LOAD_EVENTS('moderationLog'));
  /**
   * Emitted whenever ESXBot Moeda is credited from a user.
   * @listens userCredit
   */
  ESXBot.on('userCredit', LOAD_EVENTS('userCredit'));
  /**
   * Emitted whenever ESXBot Moeda is debited to a user.
   * @listens userDebit
   */
  ESXBot.on('userDebit', LOAD_EVENTS('userDebit'));
  /**
  * Emitted whenever the user doesn't have the required permission(s) to use a command.
  * @listens userMissingPermissions
  */
  ESXBot.on('userMissingPermissions', LOAD_EVENTS('userMissingPermissions'));
};
