/**
 * @file commands command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let modules = [ ...new Set(ESXBot.commands.map(c => c.config.module)) ];

    if (args.module) {
      args.module = args.module.join('_').toLowerCase();
      if (modules.includes(args.module)) {
        modules = [ args.module ];
      }
    }

    let fields = [];
    for (let i = 0; i < modules.length; i++) {
      let commands = ESXBot.commands.filter(c => c.config.module === modules[i]).map(c => c.help.name);
      if (commands.length === 0) {
        continue;
      }

      fields.push({
        name: modules[i].replace('_', ' ').toTitleCase(),
        value: `\`\`\`css\n${commands.join('\n')}\`\`\``
      });
    }

    let authorDMChannel = await message.author.createDM();
    await authorDMChannel.send({
      embed: {
        color: ESXBot.colors.GOLD,
        title: 'Lista de Comandos',
        description: 'Para obter uma lista completa de todos os comandos com detalhes, visite [meu website](https://esxbot.github.io/) e confira a seção de comandos: https://esxbot.github.io/commands.',
        fields: fields,
        footer: {
          text: `Total de módulos: ${modules.length} | Comandos Totais: ${ESXBot.commands.size}`
        }
      }
    });

    message.channel.send({
      embed: {
        description: `${message.author} Verifique seu DM de mim, eu te enviei a lista de comandos${args.module ? ` e ${args.module} módulo` : ''}. Você também pode verificar a seção de comandos do [meu site](https://esxbot.github.io/) para a lista completa de comandos com detalhes: https://esxbot.github.io/commands`
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 50007) {
      message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          description: `${message.author} Você precisa **permitir mensagens diretas de suas configurações de privacidade** para que eu seja capaz de te controlar com os comandos.\nSe você não preferir alterar suas configurações de privacidade, verifique a seção de comandos do [meu site](https://esxbot.github.io/) para a lista completa de comandos com detalhes: https://esxbot.github.io/commands`
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      ESXBot.log.error(e);
    }
  }
};

exports.config = {
  aliases: [ 'cmds', 'modules', 'comandos', 'modulos' ],
  enabled: true,
  argsDefinitions: [
    { name: 'module', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'commands',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commands [module name]',
  example: [ 'commands', 'commands game stats', 'commands moderation' ]
};
