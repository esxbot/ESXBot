/**
 * @file lockdown command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    if (args.remove) {
      await message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: null,
        ADD_REACTIONS: null
      });

      message.channel.send({
        embed: {
          color: ESXBot.colors.GREEN,
          title: 'Channel Lockdown Removed',
          description: 'The lockdown on this channel has now been removed, you can now send messages in this channel.',
          footer: {
            text: `Removed by ${message.author.tag}`
          }
        }
      }).catch(e => {
        ESXBot.log.error(e);
      });
    }
    else {
      await message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      });

      message.channel.send({
        embed: {
          color: ESXBot.colors.RED,
          title: 'Channel Lockdown Initiated',
          description: 'This text channel is in lockdown. You do not have permissions to send message in this channel unless you are explicitly allowed.\nAdministrators can remove the lockdown using the `lockdown --remove` command.',
          footer: {
            text: `Initiated by ${message.author.tag}`
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'lockdown',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'lockdown [--remove]',
  example: [ 'lockdown', 'lockdown --remove' ]
};
