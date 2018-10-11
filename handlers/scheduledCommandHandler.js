/**
 * @file scheduledCommandHandler
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const CronJob = require('cron').CronJob;
const parseArgs = require('command-line-args');

/**
 * Handles ESXBot's scheduled commands
 * @param {ESXBot} ESXBot ESXBot Discord client object
 * @returns {void}
 */
module.exports = ESXBot => {
  setTimeout(async () => {
    try {
      let scheduledCommands = await ESXBot.db.all('SELECT cronExp, command, channelID, messageID, arguments FROM scheduledCommands');

      if (scheduledCommands.length === 0) return;

      for (let i = 0; i < scheduledCommands.length; i++) {
        let cronExp = scheduledCommands[i].cronExp,
          command = scheduledCommands[i].command.toLowerCase(), cmd,
          channel = ESXBot.channels.get(scheduledCommands[i].channelID);
        if (!channel) {
          removeScheduledCommandByChannelID(ESXBot, scheduledCommands[i].channelID);
          continue;
        }
        let args = scheduledCommands[i].arguments ? scheduledCommands[i].arguments.split(' ') : '';

        let job = new CronJob(cronExp,
          async function () {
            let message = await channel.fetchMessage(scheduledCommands[i].messageID).catch(e => {
              if (e.toString().includes('Unknown Message')) {
                job.stop();
                removeScheduledCommandByMessageID(ESXBot, scheduledCommands[i].messageID);
              }
              else {
                ESXBot.log.error(e);
              }
            });

            if (ESXBot.commands.has(command)) {
              cmd = ESXBot.commands.get(command);
            }
            else if (ESXBot.aliases.has(command)) {
              cmd = ESXBot.commands.get(ESXBot.aliases.get(command).toLowerCase());
            }
            else {
              job.stop();
              return removeScheduledCommandByCommandName(ESXBot, command);
            }

            if (cmd.config.enabled) {
              cmd.exec(ESXBot, message, parseArgs(cmd.config.argsDefinitions, { argv: args, partial: true }));
            }
          },
          function () {},
          false // Start the job right now
        );
        job.start();
      }
    }
    catch (e) {
      ESXBot.log.error(e);
    }
  }, 5 * 1000);
};

/**
 * Removes ESXBot's scheduled commands
 * @param {ESXBot} ESXBot ESXBot Discord client object
 * @param {String} channelID The Snowflake ID of the channel where the command is scheduled
 * @returns {void}
 */
function removeScheduledCommandByChannelID(ESXBot, channelID) {
  ESXBot.db.run(`DELETE FROM scheduledCommands WHERE channelID='${channelID}'`).catch(e => {
    ESXBot.log.error(e);
  });
}

/**
 * Removes ESXBot's scheduled commands
 * @param {ESXBot} ESXBot ESXBot Discord client object
 * @param {String} messageID The Snowflake ID of the message that holds the scheduled command's info
 * @returns {void}
 */
function removeScheduledCommandByMessageID(ESXBot, messageID) {
  ESXBot.db.run(`DELETE FROM scheduledCommands WHERE messageID='${messageID}'`).catch(e => {
    ESXBot.log.error(e);
  });
}

/**
 * Removes ESXBot's scheduled commands
 * @param {ESXBot} ESXBot ESXBot Discord client object
 * @param {String} commandName The name of the command that is scheduled
 * @returns {void}
 */
function removeScheduledCommandByCommandName(ESXBot, commandName) {
  ESXBot.db.run(`DELETE FROM scheduledCommands WHERE command='${commandName}'`).catch(e => {
    ESXBot.log.error(e);
  });
}
