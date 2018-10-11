/**
 * @file searchServer command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  let guilds = ESXBot.guilds.filter(g => g.name.toLowerCase().includes(args.join(' ').toLowerCase())).map(g => `${g.name} - ${g.id}`);
  let total = guilds.length;
  guilds = total > 0 ? guilds.slice(0, 10).join('\n') : 'None';

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'Server search',
      description: `Found **${total}** servers${ESXBot.shard ? `, in Shard ${ESXBot.shard.id},` : ''} with **${args.join(' ')}** in it's name.`,
      fields: [
        {
          name: 'Servers',
          value: total > 10 ? `and ${total - 10} more.` : guilds
        }
      ]
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'servers' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'searchServer',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'searchServer <name>',
  example: [ 'searchServer ESXBot' ]
};
