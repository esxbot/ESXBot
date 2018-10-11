/**
 * @file generateInvite command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = async (ESXBot, message, args) => {
  try {
    let invite = await message.channel.createInvite({
      maxAge: args.age * 60,
      maxUses: args.uses
    });

    message.channel.send('Olá. Beep. Boop\n'
      + 'Se você quiser convidar amigos para este servidor, compartilhe o seguinte convite'
      + ' link com seus amigos.\nBeep!\n' +
      `https://discord.gg/${invite.code}`).catch(e => {
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
    { name: 'uses', type: Number, alias: 'u', defaultValue: 3 },
    { name: 'age', type: Number, alias: 'a', defaultValue: 1440 }
  ]
};

exports.help = {
  name: 'generateInvite',
  botPermission: 'CREATE_INSTANT_INVITE',
  userTextPermission: 'CREATE_INSTANT_INVITE',
  userVoicePermission: '',
  usage: 'generateInvite [-u <NO_OF_USES>] [-a <INVITE_LINK_TIMEOUT_IN_MINUTES>]',
  example: [ 'generateInvite', 'generateInvite -u 1 -a 10' ]
};
