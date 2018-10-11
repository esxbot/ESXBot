/**
 * @file ready event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const COLOR = require('chalk');

module.exports = async ESXBot => {
  try {
    if (ESXBot.shard && ESXBot.shard.id + 1 === ESXBot.shard.count) {
      await ESXBot.shard.broadcastEval('process.env.SHARDS_READY = true');
    }

    ESXBot.user.setPresence({
      status: ESXBot.config.status,
      game: {
        name: typeof ESXBot.config.game.name === 'string' ? ESXBot.config.game.name : ESXBot.config.game.name.length ? ESXBot.config.game.name[0] : null,
        type: ESXBot.config.game.type,
        url: ESXBot.config.game.url && ESXBot.config.game.url.trim().length ? ESXBot.config.game.url : null
      }
    });

    if (typeof ESXBot.config.game.name !== 'string' && ESXBot.config.game.name.length) {
      ESXBot.setInterval(async () => {
        try {
          await ESXBot.user.setActivity(ESXBot.config.game.name[Math.floor(Math.random() * ESXBot.config.game.name.length)],
            {
              type: ESXBot.config.game.type,
              url: ESXBot.config.game.url && ESXBot.config.game.url.trim().length ? ESXBot.config.game.url : null
            });
        }
        catch (e) {
          ESXBot.log.error(e);
        }
      }, ((typeof ESXBot.config.game.interval === 'number' && ESXBot.config.game.interval) || 60) * 60 * 1000);
    }

    let esxbotGuilds = ESXBot.guilds.map(g => g.id);
    let guild = await ESXBot.db.all('SELECT guildID from guildSettings');
    guild = guild.map(r => r.guildID);

    /*
    * Add guilds to the DB which added ESXBot when it was offline.
    */
    for (let i = 0; i < esxbotGuilds.length; i++) {
      let found = false;
      for (let j = 0; j < guild.length; j++) {
        if (esxbotGuilds[i] === guild[j]){
          found = true;
          break;
        }
      }
      if (found === false) {
        await ESXBot.db.run('INSERT INTO guildSettings (guildID) VALUES (?)', [ esxbotGuilds[i] ]);
      }
    }

    /*
    * Remove guilds from DB which removed ESXBot when it was offline.
    */
    // for (let i = 0; i < guild.length; i++) {
    //   let found = false;
    //   for (let j = 0; j < esxbotGuilds.length; j++) {
    //     if (guild[i] === esxbotGuilds[j]){
    //       found = true;
    //       break;
    //     }
    //   }
    //   if (found === false) {
    //     await ESXBot.db.run(`DELETE FROM guildSettings WHERE guildID=${guild[i]}`);
    //   }
    // }

    require('../handlers/scheduledCommandHandler')(ESXBot);
    require('../handlers/streamNotifier')(ESXBot);

    if (ESXBot.shard) {
      ESXBot.log.console(`${COLOR.cyan(`[${ESXBot.user.username}]:`)} Shard ${ESXBot.shard.id} is ready with ${ESXBot.guilds.size} servers.`);

      ESXBot.webhook.send('esxbotLog', {
        title: `Launched Shard ${ESXBot.shard.id}`,
        description: `Shard ${ESXBot.shard.id} está pronto com ${ESXBot.guilds.size} servidores.`,
        footer: {
          icon_url: 'https://resources-esx.github.io/images/hourglass_loading.gif',
          text: `Launched ${ESXBot.shard.id + 1} de ${ESXBot.shard.count} shards.`
        },
        timestamp: new Date()
      });
    }

    if (!ESXBot.shard || process.env.SHARDS_READY) {
      let guilds = ESXBot.shard ? await ESXBot.shard.broadcastEval('this.guilds.size') : ESXBot.guilds.size;
      if (guilds instanceof Array) {
        guilds = guilds.reduce((sum, val) => sum + val, 0);
      }

      ESXBot.log.console('\n');
      ESXBot.log.console(COLOR.green('[Autor] ') + ESXBot.package.author);
      ESXBot.log.console(`${COLOR.green('[Bot]')} ESXBot v${ESXBot.package.version}`);
      ESXBot.log.console(COLOR.green('[URL] ') + ESXBot.package.url);
      ESXBot.log.console(COLOR.green('[Bot ID] ') + ESXBot.credentials.botId);
      ESXBot.log.console(COLOR.green('[IDs do proprietário] ') + ESXBot.credentials.ownerId.join(', '));
      ESXBot.log.console(COLOR.green('[Servidores] ') + guilds);
      ESXBot.log.console(COLOR.green('[Prefixo] ') + ESXBot.config.prefix);
      ESXBot.log.console(`${COLOR.cyan(`\n[${ESXBot.user.username}]:`)} Estou pronto para rodar! o7`);

      ESXBot.webhook.send('esxbotLog', {
        color: ESXBot.colors.BLUE,
        title: 'Estou pronto para rodar!',
        description: `Conectado a ${guilds} servidores${ESXBot.shard ? ` em ${ESXBot.shard.count} shards` : ''}.`,
        footer: {
          icon_url: 'https://resources-esx.github.io/logos/Bastion_Logomark_C.png',
          text: `ESXBot v${ESXBot.package.version}`
        },
        timestamp: new Date()
      });
    }
  }
  catch (e) {
    ESXBot.log.error(e);
    process.exit(1);
  }
};
