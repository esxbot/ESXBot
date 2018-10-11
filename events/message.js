/**
 * @file message event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const credentialsFilter = require('../utils/credentialsFilter');
const wordFilter = require('../utils/wordFilter');
const linkFilter = require('../utils/linkFilter');
const inviteFilter = require('../utils/inviteFilter');
const mentionSpamFilter = require('../utils/mentionSpamFilter');
const handleTrigger = require('../handlers/triggerHandler');
const handleUserLevel = require('../handlers/levelHandler');
const handleCommand = require('../handlers/commandHandler');
const handleConversation = require('../handlers/conversationHandler');
const handleDirectMessage = require('../handlers/directMessageHandler');
let recentLevelUps = [];
let recentUsers = {};

module.exports = async message => {
  try {
    /**
     * Filter ESXBot's credentials from the message
     */
    if (await credentialsFilter(message)) return;

    /**
     * If the message author is a bot, ignore it.
     */
    if (message.author.bot) return;

    if (message.guild) {
      /**
       * Filter specific words from the message
       */
      if (await wordFilter(message)) return;

      /**
       * Filter links from the message
       */
      if (await linkFilter(message)) return;

      /**
       * Filter Discord server invites from the message
       */
      if (await inviteFilter(message)) return;

      /**
       * Moderate mention spams in the message
       */
      if (await mentionSpamFilter(message)) return;

      if (!message.channel.permissionsFor(message.member) || !message.channel.permissionsFor(message.member).has('MANAGE_ROLES')) {
        let guildSettings = await message.client.db.get(`SELECT slowMode FROM guildSettings WHERE guildID=${message.guild.id}`);
        if (guildSettings && guildSettings.slowMode) {
          if (recentUsers.hasOwnProperty(message.author.id)) {
            let title, description;

            ++recentUsers[message.author.id];
            if (recentUsers[message.author.id] >= 8) {
              title = 'Aviso!.';
              description = `${message.author} você foi silenciado por 15 minutos.`;
              await message.channel.overwritePermissions(message.author, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              });

              setTimeout(() => {
                let permissionOverwrites = message.channel.permissionOverwrites.get(message.author.id);
                if (permissionOverwrites) {
                  if (permissionOverwrites.deny === 2112) {
                    permissionOverwrites.delete();
                  }
                  else {
                    message.channel.overwritePermissions(message.author, {
                      SEND_MESSAGES: null,
                      ADD_REACTIONS: null
                    }).catch(e => {
                      message.client.log.error(e);
                    });
                  }
                }
              }, 15 * 60 * 1000);
            }
            else if (recentUsers[message.author.id] >= 6) {
              title = 'Cooldown, senhor das trevas.';
              description = `${message.author} você está enviando mensagens muito rapidamente.`;
            }
            else if (recentUsers[message.author.id] >= 4) {
              title = 'Woah lá. Muito picante.';
              description = `${message.author} você está enviando mensagens muito rapidamente.`;
            }

            if (title && description) {
              await message.channel.send({
                embed: {
                  color: message.client.colors.ORANGE,
                  title: title,
                  description: description
                }
              });
            }
          }
          else {
            recentUsers[message.author.id] = 1;

            setTimeout(() => {
              delete recentUsers[message.author.id];
            }, 5 * 1000);
          }
        }
      }

      /**
       * Check if the message contains a trigger and respond to it
       */
      handleTrigger(message);

      try {
        let users = await message.client.db.all('SELECT userID FROM blacklistedUsers');
        if (users.map(u => u.userID).includes(message.author.id)) return;
      }
      catch (e) {
        message.client.log.error(e);
      }

      /**
      * Cooldown for experience points, to prevent spam
      */
      if (!recentLevelUps.includes(message.author.id)) {
        recentLevelUps.push(message.author.id);
        setTimeout(function () {
          recentLevelUps.splice(recentLevelUps.indexOf(message.author.id), 1);
        }, 20 * 1000);
        /**
        * Increase experience and level up user
        */
        handleUserLevel(message);
      }

      /**
      * Handles ESXBot's commands
      */
      handleCommand(message);

      /**
      * Check if the message starts with mentioning ESXBot
      */
      if (message.content.startsWith(`<@${message.client.credentials.botId}>`) || message.content.startsWith(`<@!${message.client.credentials.botId}>`)) {
        /**
        * Handles conversations with ESXBot
        */
        handleConversation(message);
      }

      /**
       * Set message for voting, if it's a voting channel.
       */
      let guildSettings = await message.client.db.get(`SELECT votingChannels FROM guildSettings WHERE guildID=${message.guild.id}`);
      if (!guildSettings || !guildSettings.votingChannels) return;
      guildSettings.votingChannels = guildSettings.votingChannels.split(' ');
      if (!guildSettings.votingChannels.includes(message.channel.id)) return;

      // Add reactions for voting
      await message.react('👍');
      await message.react('👎');
    }
    else {
      /**
       * Handles direct messages sent to ESXBot
       */
      handleDirectMessage(message);
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
