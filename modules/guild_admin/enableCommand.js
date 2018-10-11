/**
 * @file enableCommand command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  let description;
  if (args.name) {
    let command = args.name.toLowerCase();

    if (ESXBot.commands.has(command) || ESXBot.aliases.has(command)) {
      if (ESXBot.commands.has(command)) {
        command = ESXBot.commands.get(command);
      }
      else if (ESXBot.aliases.has(command)) {
        command = ESXBot.commands.get(ESXBot.aliases.get(command).toLowerCase());
      }
    }
    else {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'command'), message.channel);
    }

    if (![ 'owner', 'guild_admin' ].includes(command.config.module)) {
      let guildSettings = await ESXBot.db.get(`SELECT disabledCommands FROM guildSettings WHERE guildID=${message.guild.id}`);
      if (guildSettings.disabledCommands) {
        guildSettings.disabledCommands = guildSettings.disabledCommands.split(' ');

        if (guildSettings.disabledCommands.includes(command.help.name.toLowerCase())) {
          guildSettings.disabledCommands.splice(guildSettings.disabledCommands.indexOf(command.help.name.toLowerCase()), 1);

          await ESXBot.db.run(`UPDATE guildSettings SET disabledCommands='${guildSettings.disabledCommands.join(' ').toLowerCase()}' WHERE guildID=${message.guild.id}`);
        }
      }
    }

    description = ESXBot.strings.info(message.guild.language, 'enableCommand', message.author.tag, command.help.name);
  }
  else if (args.all) {
    await ESXBot.db.run(`UPDATE guildSettings SET disabledCommands=NULL WHERE guildID=${message.guild.id}`);
    description = ESXBot.strings.info(message.guild.language, 'enableAllCommands', message.author.tag);
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
      color: ESXBot.colors.GREEN,
      description: description
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'enablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'enableCommand',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'enableCommand < COMMAND_NAME | --all >',
  example: [ 'enableCommand echo', 'enableCommand --all' ]
};
