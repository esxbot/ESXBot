/**
 * @file levelHandler
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

/**
 * Handles user's experience points and levels
 * @param {Message} message Discord.js message object
 * @returns {void}
 */

const { esxbotGuild } = require('../data/specialIDs.json');

module.exports = async message => {
  try {
    let profile = await message.client.db.get(`SELECT * FROM profiles WHERE userID=${message.author.id}`);

    if (!profile) {
      await message.client.db.run('INSERT INTO profiles (userID, xp) VALUES (?, ?)', [ message.author.id, 1 ]);
    }
    else {
      profile.xp = parseInt(profile.xp);
      profile.level = parseInt(profile.level);
      profile.esxbotCurrencies = parseInt(profile.esxbotCurrencies);

      let incrementedXP = profile.xp + 1;
      if (message.guild.id === esxbotGuild && message.createdAt - message.member.joinedAt > 86400000) {
        incrementedXP++;
      }

      let currentLevel = Math.floor(0.15 * Math.sqrt(incrementedXP));

      if (currentLevel > profile.level) {
        await message.client.db.run(`UPDATE profiles SET esxbotCurrencies=${profile.esxbotCurrencies + currentLevel * 5}, xp=${incrementedXP}, level=${currentLevel} WHERE userID=${message.author.id}`);

        let guildSettings = await message.client.db.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`);
        if (!guildSettings.levelUpMessage) return;

        message.channel.send({
          embed: {
            color: message.client.colors.BLUE,
            title: 'Nivelado',
            description: `:up: **${message.author.username}**#${message.author.discriminator} nivelado até **Nível ${currentLevel}**`
          }
        }).then(msg => {
          msg.delete(5000).catch(() => {});
        }).catch(e => {
          message.client.log.error(e);
        });
      }
      else {
        await message.client.db.run(`UPDATE profiles SET xp=${incrementedXP} WHERE userID=${message.author.id}`);
      }

      // Level up roles
      let guildSettings = await message.client.db.get(`SELECT levelUpRoles FROM guildSettings WHERE guildID=${message.guild.id}`);
      if (guildSettings && guildSettings.levelUpRoles) {
        let levelUpRoles = await message.client.functions.decodeString(guildSettings.levelUpRoles);
        levelUpRoles = JSON.parse(levelUpRoles);

        let level = `${currentLevel}`;
        if (levelUpRoles.hasOwnProperty(level)) {
          let roles = levelUpRoles[level].split(' ');
          await message.member.addRoles(roles).catch(() => {});
        }
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
