/**
 * @file commandSearch command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (args.length < 1 || args.join('').length < 2) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  args = args.join('').toLowerCase();
  let commands = ESXBot.commands.map(c => c.help.name.toLowerCase()).filter(c => c.includes(args));
  if (commands.length === 0) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'command'), message.channel);
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.GOLD,
      title: 'Pesquisa de Comando',
      description: `Encontrado ${commands.length} comandos contendo *${args}*.`,
      fields: [
        {
          name: 'Comandos',
          value: `${message.guild.prefix[0]}${commands.join(`\n${message.guild.prefix[0]}`)}`
        }
      ]
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'cmdsearch' ],
  enabled: true
};

exports.help = {
  name: 'commandSearch',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commandSearch <keyword>',
  example: [ 'commandSearch user' ]
};
