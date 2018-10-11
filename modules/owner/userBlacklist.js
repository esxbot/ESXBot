/**
 * @file userBlacklist command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let user = [];
    args.forEach(uid => {
      if (parseInt(uid) < 9223372036854775807) {
        user.push(uid);
      }
    });
    user = user.concat(message.mentions.users.map(u => u.id));

    await ESXBot.db.run('CREATE TABLE IF NOT EXISTS blacklistedUsers (userID TEXT NOT NULL UNIQUE, PRIMARY KEY(userID))');

    let blUsers = await ESXBot.db.all('SELECT userID from blacklistedUsers');
    blUsers = blUsers.map(u => u.userID);
    let title, color;

    if (/^(add|\+)$/i.test(args[0])) {
      for (let i = 0; i < user.length; i++) {
        if (blUsers.includes(user[i])) continue;
        ESXBot.db.run('INSERT OR IGNORE INTO blacklistedUsers (userID) VALUES (?)', [ user[i] ]).catch(e => {
          ESXBot.log.error(e);
        });
      }
      color = ESXBot.colors.RED;
      title = 'Added to blacklisted users';
    }
    else if (/^(remove|rem|-)$/i.test(args[0])) {
      for (let i = 0; i < user.length; i++) {
        if (!blUsers.includes(user[i])) continue;
        ESXBot.db.run(`DELETE FROM blacklistedUsers where userID=${user[i]}`).catch(e => {
          ESXBot.log.error(e);
        });
      }
      color = ESXBot.colors.GREEN;
      title = 'Removed from blacklisted users';
    }
    else {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
        description: user.join(', ')
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
  aliases: [ 'ubl' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'userBlacklist',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'userblacklist <+|-|add|rem> <@user-mention|user_id>',
  example: [ 'userblacklist add @user#001 224433119988776655', 'userblacklist rem 224433119988776655 @user#0001', 'userblacklist + @user#001 224433119988776655', 'userblacklist - 224433119988776655 @user#0001' ]
};
