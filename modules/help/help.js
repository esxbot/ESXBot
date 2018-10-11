/**
 * @file help command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.command) {
      let channel, command = args.command.toLowerCase();
      if (ESXBot.commands.has(command) || ESXBot.aliases.has(command)) {
        if (ESXBot.commands.has(command)) {
          command = ESXBot.commands.get(command);
        }
        else if (ESXBot.aliases.has(command)) {
          command = ESXBot.commands.get(ESXBot.aliases.get(command).toLowerCase());
        }
        let example = [];
        if (command.help.example.length < 1) {
          example.push('-');
        }
        else {
          for (let i = 0; i < command.help.example.length; i++) {
            example.push(`\`\`\`${message.guild.prefix[0]}${command.help.example[i]}\`\`\``);
          }
        }

        if (args.dm) {
          channel = message.author;
        }
        else {
          channel = message.channel;
        }

        await channel.send({
          embed: {
            color: ESXBot.colors.GOLD,
            fields: [
              {
                name: 'Command',
                value: `\`${command.help.name}\``,
                inline: true
              },
              {
                name: 'Aliases',
                value: command.config.aliases.join(', ') || '-',
                inline: true
              },
              {
                name: 'Module',
                value: command.config.module.replace('_', ' ').toTitleCase(),
                inline: true
              },
              {
                name: 'Description',
                value: ESXBot.strings.command(message.guild.language, command.config.module, command.help.name),
                inline: false
              },
              {
                name: 'BOT Permissions',
                value: `\`${command.help.botPermission || '-'}\``,
                inline: true
              },
              {
                name: 'User Permissions',
                value: `\`${command.config.ownerOnly ? 'Bot Owner' : command.config.musicMasterOnly ? 'Music Master' : command.help.userTextPermission || '-'}\``,
                inline: true
              },
              {
                name: 'Usage',
                value: `\`\`\`${message.guild.prefix[0]}${command.help.usage}\`\`\``,
                inline: false
              },
              {
                name: 'Example',
                value: example.join('\n'),
                inline: false
              }
            ],
            footer: {
              text: command.config.enabled ? '' : 'This command is temporarily disabled.'
            }
          }
        });
      }
      else {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return ESXBot.emit('error', ESXBot.strings.error(message.guild.language, 'notFound'), ESXBot.strings.error(message.guild.language, 'notFound', true, 'command'), message.channel);
      }
    }
    else {
      message.channel.send({
        embed: {
          color: ESXBot.colors.GOLD,
          title: 'Ajudar',
          description: `Para obter a lista de comandos, digite \`${message.guild.prefix[0]}commands\`.` +
                       `\nPara obter ajuda sobre um comando específico, digite \`${message.guild.prefix[0]}help <command_name>\`.` +
                       `\n\nPrecisa de ajuda ou suporte com o ESXBot?\n${message.guild.id === '432980396070666250' ? 'Peça ajuda no <#499653957829001216> canal.' : 'Entrer no [**ESXBot HQ**](https://discord.gg/8zGbh3T) para testar os comandos ou qualquer ajuda que você precisa com o bot ou talvez apenas por diversão.\nhttps://discord.gg/8zGbh3T'}`,
          fields: [
            {
              name: 'ESXBot HQ Convidar Link',
              value: 'https://discord.gg/8zGbh3T'
            },
            {
              name: 'Bot ESXBot Convidar Link ',
              value: `https://discordapp.com/oauth2/authorize?client_id=${ESXBot.user.id}&scope=bot&permissions=8`
            }
          ],
          thumbnail: {
            url: ESXBot.user.displayAvatarURL
          },
          footer: {
            text: `Prefixo do Servidor: ${message.guild.prefix.join(' ')} • Comandos Totais: ${ESXBot.commands.size}`
          }
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [ 'h', 'ajudar' ],
  enabled: true,
  argsDefinitions: [
    { name: 'command', type: String, alias: 'c', defaultOption: true },
    { name: 'dm', type: Boolean }
  ]
};

exports.help = {
  name: 'help',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'help [command_name [--dm]]',
  example: [ 'help', 'help magic8ball', 'help acrophobia --dm' ]
};
