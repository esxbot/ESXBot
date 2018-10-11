/**
 * @file magic8ball command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message, args) => {
  if (args.length < 2 || !args.join(' ').endsWith('?')) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return ESXBot.emit('commandUsage', message, this.help);
  }

  let outcomes = [
    'It\'s certain',
    'It\'s decidedly so',
    'Without a doubt',
    'Yes definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    'Reply hazy try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
    'Don\'t count on it',
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful'
  ];

  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: args.join(' '),
      description: outcomes[Math.floor(Math.random() * outcomes.length)],
      footer: {
        text: '🎱 Magic 8-ball'
      }
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: [ '8ball' ],
  enabled: true
};

exports.help = {
  name: 'magic8ball',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'magic8ball <Question>?',
  example: [ 'magic8ball Do I need a new lease on life?' ]
};
