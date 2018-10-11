/**
 * @file addWhitelistDomains command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (!args.domains || args.domains.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    let guildSettings = await ESXBot.db.get(`SELECT whitelistDomains FROM guildSettings WHERE guildID=${message.guild.id}`);

    let whitelistDomains = JSON.parse(guildSettings.whitelistDomains);
    whitelistDomains = whitelistDomains.concat(args.domains);
    whitelistDomains = [ ...new Set(whitelistDomains) ];

    await ESXBot.db.run(`UPDATE guildSettings SET whitelistDomains='${JSON.stringify(whitelistDomains)}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: ESXBot.colors.GREEN,
        title: 'Added Domains to Whitelist',
        description: args.domains.join('\n')
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'domains', type: String, alias: 'd', multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'addWhitelistDomains',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addWhitelistDomains [Domain] [anotherDomain] [someOtherDomain]',
  example: [ 'addWhitelistDomains https://esxbot.github.io https://*.sankarsankampa.com' ]
};
