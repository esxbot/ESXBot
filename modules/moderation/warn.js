/**
 * @file warn command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await ESXBot.fetchUser(args.id);
    }
    if (!user) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let member = await message.guild.fetchMember(user.id);
    if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return ESXBot.log.info(ESXBot.strings.error(message.guild.language, 'lowerRole', true));

    args.reason = args.reason.join(' ');

    if (!message.guild.warns) {
      message.guild.warns = {};
    }
    if (!message.guild.warns.hasOwnProperty(user.id)) {
      message.guild.warns[user.id] = 1;
    }
    else {
      if (message.guild.warns[user.id] >= 2) {
        let guildSettings = await ESXBot.db.get(`SELECT warnAction FROM guildSettings WHERE guildID='${message.guild.id}'`);

        if (guildSettings.warnAction) {
          let action;
          if (guildSettings.warnAction === 'kick') {
            if (!member.kickable) {
              /**
              * Error condition is encountered.
              * @fires error
              */
              return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), `I don't have permissions to kick ${user}.`, message.channel);
            }
            await member.kick('Warned 3 times!');
            action = 'Kicked';
          }
          if (guildSettings.warnAction === 'softban') {
            if (!member.bannable) {
              /**
              * Error condition is encountered.
              * @fires error
              */
              return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), `I don't have permissions to soft-ban ${user}.`, message.channel);
            }
            await member.ban('Warned 3 times!');
            await message.guild.unban(member.id);
            action = 'Soft-Banned';
          }
          if (guildSettings.warnAction === 'ban') {
            if (!member.bannable) {
              /**
              * Error condition is encountered.
              * @fires error
              */
              return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), `I don't have permissions to ban ${user}.`, message.channel);
            }
            await member.ban('Warned 3 times!');
            action = 'Banned';
          }

          delete message.guild.warns[user.id];
          message.channel.send({
            embed: {
              color: ESXBot.colors.RED,
              title: action,
              fields: [
                {
                  name: 'User',
                  value: user.tag,
                  inline: true
                },
                {
                  name: 'ID',
                  value: user.id,
                  inline: true
                },
                {
                  name: 'Reason',
                  value: 'Warned 3 times!',
                  inline: false
                }
              ]
            }
          }).catch(e => {
            ESXBot.log.error(e);
          });

          ESXBot.emit('moderationLog', message.guild, message.author, guildSettings.warnAction, user, 'Warned 3 times!');

          member.send({
            embed: {
              color: ESXBot.colors.RED,
              title: `${action} from ${message.guild.name} Server`,
              fields: [
                {
                  name: 'Reason',
                  value: 'You have been warned 3 times!'
                }
              ]
            }
          }).catch(e => {
            ESXBot.log.error(e);
          });
        }
      }
      else {
        message.guild.warns[user.id] += 1;
      }
    }

    message.channel.send({
      embed: {
        color: ESXBot.colors.ORANGE,
        description: ESXBot.strings.info(message.guild.language, 'warn', message.author.tag, user.tag, args.reason)
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });

    let DMChannel = await user.createDM();
    DMChannel.send({
      embed: {
        color: ESXBot.colors.ORANGE,
        description: ESXBot.strings.info(message.guild.language, 'warnDM', message.author.tag, message.guild.name, args.reason)
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    ESXBot.emit('moderationLog', message.guild, message.author, this.help.name, user, args.reason);
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'w' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'warn',
  botPermission: 'KICK_MEMBERS',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'warn <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'warn @user#001 -r NSFW in non NSFW channels', 'warn 167147569575323761 -r Advertisements' ]
};
