/**
 * @file disableCommand command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  let disabledCommands, title, description;
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

    if ([ 'owner', 'guild_admin' ].includes(command.config.module)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), ESXBot.strings.error(message.guild.language, 'commandNoDisable', true, command.help.name), message.channel);
    }

    let guildSettings = await ESXBot.db.get(`SELECT disabledCommands FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (guildSettings.disabledCommands) {
      guildSettings.disabledCommands = guildSettings.disabledCommands.split(' ');
      guildSettings.disabledCommands.push(command.help.name.toLowerCase());
    }
    else {
      guildSettings.disabledCommands = [ command.help.name.toLowerCase() ];
    }

    guildSettings.disabledCommands = [ ...new Set(guildSettings.disabledCommands) ];

    disabledCommands = guildSettings.disabledCommands.join(' ').toLowerCase();
    description = ESXBot.strings.info(message.guild.language, 'disableCommand', message.author.tag, command.help.name);

    await ESXBot.db.run(`UPDATE guildSettings SET disabledCommands='${disabledCommands}' WHERE guildID=${message.guild.id}`);
  }
  else if (args.module) {
    args.module = args.module.join('_').toLowerCase();
    if ([ 'owner', 'guild_admin' ].includes(args.module)) {
      return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'forbidden'), 'You can\'t disable commands in this module.', message.channel);
    }

    disabledCommands = ESXBot.commands.filter(c => c.config.module === args.module).map(c => c.help.name).join(' ').toLowerCase();

    let guildSettings = await ESXBot.db.get(`SELECT disabledCommands FROM guildSettings WHERE guildID=${message.guild.id}`);
    if (guildSettings.disabledCommands) {
      disabledCommands += ` ${guildSettings.disabledCommands}`;
    }

    description = ESXBot.strings.info(message.guild.language, 'disableModule', message.author.tag, args.module);

    await ESXBot.db.run(`UPDATE guildSettings SET disabledCommands='${disabledCommands}' WHERE guildID=${message.guild.id}`);
  }
  else if (args.all) {
    disabledCommands = ESXBot.commands.filter(c => ![ 'owner', 'guild_admin' ].includes(c.config.module)).map(c => c.help.name).join(' ').toLowerCase();
    description = ESXBot.strings.info(message.guild.language, 'disableAllCommands', message.author.tag);

    await ESXBot.db.run(`UPDATE guildSettings SET disabledCommands='${disabledCommands}' WHERE guildID=${message.guild.id}`);
  }
  else {
    let guildSettings = await ESXBot.db.get(`SELECT disabledCommands FROM guildSettings WHERE guildID=${message.guild.id}`);
    title = 'Commands disabled in this server:';
    description = guildSettings.disabledCommands ? guildSettings.disabledCommands.replace(/ /g, ', ') : 'No command has been disabled in this server. Check `help disableCommand` for more info.';
  }

  message.channel.send({
    embed: {
      color: ESXBot.colors.RED,
      title: title,
      description: description
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ 'disablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'module', type: String, multiple: true, alias: 'm' },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'disableCommand',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'disableCommand [ COMMAND_NAME | --module MODULE NAME | --all ]',
  example: [ 'disableCommand echo', 'disableCommand --module game stats', 'disableCommand --all' ]
};
